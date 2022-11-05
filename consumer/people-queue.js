require('dotenv').config();
const amqplib = require('amqplib');
const Queue = require('../model/queue-model');
const MessageQueueService = require('../config/rabbitmq');
const PaymentQueue = new MessageQueueService('payment');

const EXCHANGE_NAME = 'people_queue';
const EXCHANGE_PAY_NAME = 'check_payment';
const CACHE_STANDBY_KEY = 'standby';
const QUEUE_NAME = 'waiting';

const { TIME_LIMIT, STOCK, RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASSWORD } = process.env;

const STATUS = {
    FAIL: -1,
    STANDBY: 0,
    SUCCESS: 1,
    PAID: 2,
};

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
        protocol: 'amqp',
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
    channel.consume(
        q.queue,
        async (msg) => {
            console.debug('');
            console.debug('Receive Message! Processing....');
            if (msg.content) {
                const userId = Number(msg.content);
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
                        await Promise.all([Queue.setStatus(userId, STATUS.FAIL), Queue.addStock()]);
                        console.debug('庫存已全部賣完');
                        return;
                    }
                    console.debug('加入候補名單');
                    await Promise.all([Queue.setStatus(userId, STATUS.STANDBY), Queue.addStock(), Queue.enqueue(CACHE_STANDBY_KEY, userId)]);
                    return;
                }
                // 使用者搶購成功
                io.to(userId).emit('notify', userId);
                await Queue.setStatus(userId, STATUS.SUCCESS);
                console.debug('搶購成功');
                console.debug('現在庫存剩', stock, '個');
                await PaymentQueue.publishToQueue(EXCHANGE_PAY_NAME, QUEUE_NAME, msg.content, TIME_LIMIT);
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
