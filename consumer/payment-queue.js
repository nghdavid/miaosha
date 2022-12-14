require('dotenv').config();
const amqplib = require('amqplib');
const { issuePayJWT } = require('../util/auth');
const { STATUS } = require('../util/status');
const Queue = require('../model/queue-model');
const MessageQueueService = require('../config/rabbitmq');
const PaymentQueue = new MessageQueueService('payment');

const EXCHANGE_NAME = 'check_payment';
const EXCHANGE_PAY_NAME = 'check_payment';
const CACHE_STANDBY_KEY = 'standby';
const STANDBY_QUEUE_NAME = 'waiting';
const PAY_QUEUE_NAME = 'check_payment';
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

const checkPayment = async (io) => {
    const connection = await amqplib.connect(PaymentQueue.connectParam);
    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });
    const payQueue = await channel.assertQueue(PAY_QUEUE_NAME, { durable: true });
    console.info(`Waiting for messages in queue: ${PAY_QUEUE_NAME}`);
    channel.bindQueue(payQueue.queue, EXCHANGE_NAME, ''); //第三個是routing key
    const price = await Queue.getPrice();
    const productId = await Queue.getProductId();
    channel.consume(
        PAY_QUEUE_NAME,
        async (msg) => {
            if (!msg.content) {
                console.warn('Receive nothing!');
                channel.ack(msg);
                return;
            }
            console.info('Payment queue 處理中....');
            const userId = Number(msg.content);
            console.info('The user id is: ', userId);
            const status = await Queue.getStatus(userId);
            // 確認redis有無錯誤
            if (status !== null && status.error) {
                console.error('payment checker has error');
                channel.nack(msg); // 把msg送回consumer再次requeue
                throw new Error('Cannot access cache!!!');
            }

            if (Number(status) === STATUS.PAID) {
                // 使用者已經付款，庫存名額不會釋出
                console.info(`User-${userId} 已經付過款`);
                const payment = await Queue.addSuccessPayment(); //記錄目前有幾個付款成功
                // 如果記錄到成功的payment跟STOCK一樣多，代表這是最後一筆成功的訂單
                // 也就是所有庫存算是正式賣完
                if (payment >= STOCK) {
                    // 通知所有候補者搶購失敗
                    await informStandbyFail(io);
                }
                channel.ack(msg);
                return;
            }

            // 通知逾時未付款者搶購失敗
            await informFailure(io, userId);

            // 候補使用者搶購成功
            const standbyUserId = await Queue.dequeue(CACHE_STANDBY_KEY); //從候補名單拿出一位使用者
            if (standbyUserId === null) {
                Queue.addStock(); // 回補庫存
                console.info('已經無人在候補');
                channel.ack(msg);
                return;
            }
            // 通知候補使用者搶購成功
            await informStandbySuccess(io, standbyUserId, price, productId);
            await PaymentQueue.publishToQueue(EXCHANGE_PAY_NAME, STANDBY_QUEUE_NAME, standbyUserId, Number(TIME_LIMIT));
            channel.ack(msg);
        },
        { noAck: false }
    );
};

async function informStandbyFail(io) {
    const standbyList = await Queue.getStandbyList();
    if (standbyList.length > 0) {
        await Queue.deleteStandby();
        const totalFailSets = standbyList.map((id) => {
            console.info(`User-${id}搶購失敗`);
            // 通知使用者搶購失敗
            io.to(Number(id)).emit('notify', STATUS.FAIL);
            return Queue.setStatus(id, STATUS.FAIL);
        });
        await Promise.all(totalFailSets);
    }
    console.info('庫存已全部賣完!!!!!!');
}

async function informStandbySuccess(io, standbyUserId, price, productId) {
    console.info(`User-${standbyUserId} 候補到了`); // 候補使用者搶購成功
    // 通知使用者搶購成功
    const accessToken = issuePayJWT({
        id: Number(standbyUserId),
        price,
        productId,
    });
    // 給使用者結帳jwt
    console.info(`給候補者${standbyUserId} JWT`);
    io.to(Number(standbyUserId)).emit('jwt', accessToken);
    io.to(Number(standbyUserId)).emit('notify', STATUS.SUCCESS);
    await Queue.setStatus(standbyUserId, STATUS.SUCCESS); // 更新使用者狀態為搶購成功
    await Queue.saveSuccessTime(standbyUserId, Math.round(Date.now() / 1000)); // 記錄使用者何時搶購成功
}

async function informFailure(io, userId) {
    console.info(`User-${userId} 忘記付款了`);
    io.to(userId).emit('notify', STATUS.FAIL);
    await Queue.setStatus(userId, STATUS.FAIL); // 將逾時未付款者的狀態為更新為失敗
}

module.exports = {
    checkPayment,
};
