const amqplib = require('amqplib');
const EXCHANGE_NAME = 'people_queue';
const STATUS = {
    FAIL: -1,
    STANDBY: 0,
    SUCCESS: 1,
    PAID: 2,
};

const Queue = require('../model/queue-model');

const getMsg = async () => {
    const connection = await amqplib.connect({
        protocol: 'amqp',
        hostname: 'localhost',
        port: 5672,
        username: 'guest',
        password: 'guest',
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
            console.log('Receive Message! Processing....');
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
                if (status !== null && status !== 0) {
                    // 代表使用者已經搶過且不在候補名單
                    console.debug('此使用者已經搶過');
                    return;
                }
                const stock = await Queue.decrStock(); // 庫存減一

                // 若庫存為0，將使用者加入候補名單，並將使用者的status設為3
                // 庫存也要補回來(加一)
                if (stock < 0) {
                    console.debug('加入候補名單');
                    await Promise.all([Queue.setStatus(userId, STATUS.STANDBY), Queue.addStock()]);
                    return;
                }
                // 使用者搶購成功
                await Queue.setStatus(userId, STATUS.SUCCESS);
                console.debug('搶購成功');
            } else {
                console.warn('Receive nothing!');
            }
        },
        { noAck: true }
    );
};

getMsg();
