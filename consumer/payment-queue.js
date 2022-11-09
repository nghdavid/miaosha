require('dotenv').config();
const amqplib = require('amqplib');
const { issuePayJWT } = require('../util/auth');
const { STATUS } = require('../util/status');
const Queue = require('../model/queue-model');
const MessageQueueService = require('../config/rabbitmq');
const PaymentQueue = new MessageQueueService('payment');

const CONSUMER_QUANTITY = Number(process.argv[2]);
const CONSUMER_NUM = Number(process.argv[3]);

const EXCHANGE_NAME = 'check_payment';
const EXCHANGE_PAY_NAME = 'check_payment';
const CACHE_STANDBY_KEY = 'standby';
const QUEUE_NAME = 'waiting';

const { TIME_LIMIT, STOCK, RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASSWORD } = process.env;

// Connect to RabbitMQ
(async () => {
    try {
        await PaymentQueue.connect();
    } catch (err) {
        console.error('Cannot connect to RabbitMQ');
        console.error(err);
    }
})();

const checkPayment = async (io) => {
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
    const price = await Queue.getPrice();
    const productId = await Queue.getProductId();
    channel.consume(
        q.queue,
        async (msg) => {
            console.debug('');
            console.debug('檢查有無付款了喔');
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
                    console.error('payment checker has error');
                    throw new Error('Cannot access cache!!!');
                }

                if (Number(status) === STATUS.PAID) {
                    // 使用者已經付款，庫存名額不會釋出
                    console.debug(`User-${userId} 已經付過款`);
                    const payment = await Queue.addSuccessPayment(); //記錄目前有幾個付款成功
                    // 如果記錄到成功的payment跟STOCK一樣多，代表這是最後一筆成功的訂單
                    // 也就是所有庫存算是正式賣完
                    if (payment >= STOCK) {
                        const standbyList = await Queue.getStandbyList();
                        if (standbyList.length > 0) {
                            await Queue.deleteStandby();
                            const totalFailSets = standbyList.map((id) => {
                                console.warn(`User-${id}搶購失敗`);
                                // 通知使用者搶購失敗
                                io.to(id).emit('notify', STATUS.FAIL);
                                return Queue.setStatus(id, STATUS.FAIL);
                            });
                            await Promise.all(totalFailSets);
                        }
                        console.warn('庫存已全部賣完!!!!!!');
                    }
                    return;
                }

                console.debug(`User-${userId} 忘記付款了`);
                // ? 尚不確定沒有付款的使用者要不要通知失敗
                io.to(userId).emit('notify', STATUS.FAIL);
                await Queue.setStatus(userId, STATUS.FAIL); // 將逾時未付款者的狀態為更新為失敗
                // 候補使用者搶購成功
                const standbyUserId = await Queue.dequeue(CACHE_STANDBY_KEY); //從候補名單拿出一位使用者
                if (standbyUserId === null) {
                    Queue.addStock(); // 回補庫存
                    console.info('已經無人在候補');
                    return;
                }

                const standbyStatus = await Queue.getStatus(standbyUserId);
                console.debug(`User-${standbyUserId} 排到了`); // 候補使用者搶購成功
                // 通知使用者搶購成功
                const sockets = await io.in(Number(standbyUserId)).fetchSockets();
                if (sockets.length > 0) {
                    const accessToken = issuePayJWT({
                        id: userId,
                        name: sockets[0].name,
                        email: sockets[0].email,
                        price,
                        productId,
                    });
                    // 給使用者結帳jwt
                    io.to(Number(standbyUserId)).emit('jwt', accessToken);
                }
                io.to(Number(standbyUserId)).emit('notify', STATUS.SUCCESS);
                if (Number(standbyStatus) !== STATUS.STANDBY) {
                    console.warn('This standby user is incorrect');
                    return;
                }
                await Queue.setStatus(standbyUserId, STATUS.SUCCESS); // 更新使用者狀態為搶購成功
                await Queue.saveSuccessTime(standbyUserId, Math.round(Date.now() / 1000)); // 記錄使用者何時搶購成功
                await PaymentQueue.publishToQueue(EXCHANGE_PAY_NAME, QUEUE_NAME, standbyUserId, TIME_LIMIT);
                console.debug('Send success user to waiting queue');
            } else {
                console.warn('Receive nothing!');
            }
        },
        { noAck: true }
    );
};

// checkPayment();
module.exports = {
    checkPayment,
};
