require('dotenv').config();
const amqplib = require('amqplib');
const { issuePayJWT } = require('../util/auth');
const { STATUS } = require('../util/status');
const Queue = require('../model/queue-model');
const MessageQueueService = require('../config/rabbitmq');
const PaymentQueue = new MessageQueueService('payment');

const EXCHANGE_NAME = 'people_queue';
const EXCHANGE_PAY_NAME = 'check_payment';
const CACHE_STANDBY_KEY = 'standby';
const STANDBY_QUEUE_NAME = 'waiting';
const QUEUE_NAME = 'people_queue';
const { TIME_LIMIT, STOCK } = process.env;

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
    const connection = await amqplib.connect(PaymentQueue.connectParam);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    console.log(`Waiting for messages in queue: ${QUEUE_NAME}`);
    await channel.prefetch(1);
    const price = await Queue.getPrice();
    const productId = await Queue.getProductId();
    channel.consume(
        QUEUE_NAME,
        async (msg) => {
            console.debug('');
            console.debug('People queue 處理中....');
            if (msg.content) {
                const userId = Number(msg.content);
                console.info('The user id is: ', userId);
                const status = await Queue.getStatus(userId);
                // 確認redis有無錯誤
                if (status !== null && status.error) {
                    console.error('Consumer has error');
                    channel.nack(msg); // 把msg送回consumer再次requeue
                    throw new Error('Cannot access cache!!!');
                }
                // 若使用者未搶過，status應為null
                // 若使用者搶過，status為 -1~2
                if (status !== null) {
                    // 代表使用者已經搶過
                    console.debug('此使用者已經搶過');
                    channel.ack(msg);
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
                        channel.ack(msg);
                        return;
                    }
                    console.debug('加入候補名單');
                    // 通知使用者候補中
                    io.to(userId).emit('notify', STATUS.STANDBY);
                    await Promise.all([Queue.setStatus(userId, STATUS.STANDBY), Queue.addStock(), Queue.enqueue(CACHE_STANDBY_KEY, userId)]);
                    channel.ack(msg);
                    return;
                }
                // 通知使用者搶購成功
                const accessToken = issuePayJWT({
                    id: userId,
                    price,
                    productId,
                });
                // 給使用者結帳jwt
                console.info(`給使用者${userId} JWT`);
                io.to(userId).emit('jwt', accessToken);
                io.to(userId).emit('notify', STATUS.SUCCESS);
                await Queue.setStatus(userId, STATUS.SUCCESS);
                console.debug('搶購成功');
                console.debug('現在庫存剩', stock, '個');
                await Queue.saveSuccessTime(userId, Math.round(Date.now() / 1000)); // 記錄使用者何時搶購成功
                await PaymentQueue.publishToQueue(EXCHANGE_PAY_NAME, STANDBY_QUEUE_NAME, msg.content, Number(TIME_LIMIT));
                console.debug('Send success user to waiting queue');
            } else {
                console.warn('Receive nothing!');
            }
            channel.ack(msg);
        },
        { noAck: false }
    );
};

module.exports = {
    consumer,
};
