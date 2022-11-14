require('dotenv').config();
const amqplib = require('amqplib');
const { issuePayJWT } = require('../util/auth');
const { STATUS } = require('../util/status');
const Queue = require('../model/queue-model');
const Parameter = require('../model/parameter-model');
const MessageQueueService = require('../config/rabbitmq');
const PaymentQueue = new MessageQueueService('payment');

const EXCHANGE_NAME = 'people_queue';
const EXCHANGE_PAY_NAME = 'check_payment';
const CACHE_STANDBY_KEY = 'standby';
const QUEUE_NAME = 'waiting';

const { TIME_LIMIT, STOCK, RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASSWORD, PROTOCOL } = process.env;

// Connect to RabbitMQ
(async () => {
    try {
        await PaymentQueue.connect();
    } catch (err) {
        console.error('Cannot connect to RabbitMQ');
        console.error(err);
    }
})();

const consumer = async (io) => {
    const connection = await amqplib.connect({
        protocol: PROTOCOL,
        hostname: RABBIT_HOST,
        port: RABBIT_PORT,
        username: RABBIT_USER,
        password: RABBIT_PASSWORD,
        locale: 'en_US',
        frameMax: 0,
        heartbeat: 0,
        vhost: '/',
    });
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
    const q = await channel.assertQueue('', { exclusive: true });
    console.info(`Waiting for messages in queue: ${q.queue}`);
    channel.bindQueue(q.queue, EXCHANGE_NAME, ''); //第三個是routing key

    const price = await Queue.getPrice();
    const productId = await Queue.getProductId();
    const CONSUMER_QUANTITY = await Parameter.getNumConsumer();
    const CONSUMER_NUM = await Parameter.getConsumer();
    console.debug(`Consumer有${CONSUMER_QUANTITY}個`);
    console.debug(`這是${CONSUMER_NUM + 1}號Consumer`);
    channel.consume(
        q.queue,
        async (msg) => {
            console.debug('');
            console.debug('Receive Message! Processing....');
            if (msg.content) {
                const userId = Number(msg.content);
                if (userId % CONSUMER_QUANTITY !== CONSUMER_NUM) {
                    console.debug(`我不負責user ${userId}`);
                    return;
                }
                console.debug('The user id is: ', userId);
                const status = await Queue.getStatus(userId);
                // 確認redis有無錯誤
                if (status !== null && status.error) {
                    console.error('Consumer has error');
                    throw new Error('Cannot access cache!!!');
                }
                // 若使用者未搶過，status應為null
                // 若使用者搶過，status為 -1~2
                if (status !== null) {
                    // 代表使用者已經搶過
                    console.debug('此使用者已經搶過');
                    return;
                }
                const stock = await Queue.decrStock(); // 庫存減一

                // 若庫存為0，將使用者加入候補名單，並將使用者的status設為0(standby)
                // 庫存也要補回來(加一)
                if (stock < 0) {
                    const transactionNum = await Queue.getTransaction();
                    // 若成功搶購者都已經付款，那不把使用者排入候補名單。
                    // 直接判定搶購失敗
                    if (transactionNum >= STOCK) {
                        // 通知使用者搶購失敗
                        io.to(userId).emit('notify', STATUS.FAIL);
                        await Promise.all([Queue.setStatus(userId, STATUS.FAIL), Queue.addStock()]);
                        console.debug('庫存已全部賣完');
                        return;
                    }
                    console.debug('加入候補名單');
                    // 通知使用者候補中
                    io.to(userId).emit('notify', STATUS.STANDBY);
                    await Promise.all([Queue.setStatus(userId, STATUS.STANDBY), Queue.addStock(), Queue.enqueue(CACHE_STANDBY_KEY, userId)]);
                    return;
                }
                // 通知使用者搶購成功
                const sockets = await io.in(userId).fetchSockets();
                console.debug('Num of people in room is', sockets.length);
                if (sockets.length > 0) {
                    const accessToken = issuePayJWT({
                        id: userId,
                        name: sockets[0].data.name,
                        email: sockets[0].data.email,
                        price,
                        productId,
                    });
                    console.debug('name is', sockets[0].data.name);
                    console.debug('email is', sockets[0].data.email);
                    console.debug('price is', price);
                    console.debug('product id is', productId);
                    // 給使用者結帳jwt
                    io.to(userId).emit('jwt', accessToken);
                }

                io.to(userId).emit('notify', STATUS.SUCCESS);
                await Queue.setStatus(userId, STATUS.SUCCESS);
                console.debug('搶購成功');
                console.debug('現在庫存剩', stock, '個');
                await Queue.saveSuccessTime(userId, Math.round(Date.now() / 1000)); // 記錄使用者何時搶購成功
                await PaymentQueue.publishToQueue(EXCHANGE_PAY_NAME, QUEUE_NAME, msg.content, Number(TIME_LIMIT));
                console.debug('Send success user to waiting queue');
            } else {
                console.warn('Receive nothing!');
            }
        },
        { noAck: true }
    );
};

// consumer();
module.exports = {
    consumer,
};
