const Queue = require('../model/queue-model');
const { issuePayJWT } = require('../util/auth');
const { STATUS } = require('../util/status');
const Cache = require('../config/redis-cluster').pubClient;

let price;
let productId;
// Connect to Redis
Cache.on('ready', async () => {
    price = await Queue.getPrice();
    productId = await Queue.getProductId();
});

const { CHECKOUT_PROCESS_TIME, TIME_LIMIT, PAY_TOKEN_EXPIRE } = process.env;
const waitTime = TIME_LIMIT * 60 - CHECKOUT_PROCESS_TIME * 60 - PAY_TOKEN_EXPIRE / 1000; // 使用者過了這段時間就不能拿到jwt了
console.info(`使用者過了${waitTime}秒就不能拿到JWT了`);

module.exports = (io) => {
    async function lookup() {
        const socket = this;
        let status = await Queue.getStatus(socket.data.userId);
        if (status === null) {
            return;
        }
        status = Number(status);
        console.info(`使用者${socket.data.userId}來詢問了`);
        // 代表使用者有成功送出搶購請求
        if (status === STATUS.SUCCESS) {
            // 看使用者過了多久才來查詢結果，如果拖太久才來(超過waiting time)，那就不給JWT token。
            if (await isOnTime(socket.data.userId)) {
                console.info(`來詢問的使用者${socket.data.userId}有搶購成功喔`);
                const accessToken = issuePayJWT({
                    id: socket.data.userId,
                    price,
                    productId,
                });
                console.info(`給來詢問的使用者${socket.data.userId} JWT`);
                io.to(socket.data.userId).emit('jwt', accessToken);
                io.to(socket.data.userId).emit('notify', STATUS.SUCCESS);
            } else {
                console.info(`來詢問的使用者${socket.data.userId}過太久才詢問結果了`);
            }
            return;
        }
        // 若使用者的狀態不是success，直接回傳狀態
        console.info(`來查詢的使用者${socket.data.userId}的狀態為${status}`);
        io.to(socket.data.userId).emit('notify', status);
    }

    async function isOnTime(userId) {
        const successTime = await Queue.getSuccessTime(userId); // Consumer判定此user搶購成功的時間
        const now = Math.round(Date.now() / 1000); // 現在的時間
        console.info(`從判定成功，已經過了${now - successTime}秒`);
        // 看使用者過了多久才來查詢結果，如果拖太久才來(超過waiting time)，那就判定為沒有on time
        return now - successTime < waitTime;
    }

    function disconnect() {
        const socket = this;
        console.info(`user ${socket.data.userId} disconnected`);
    }

    return {
        lookup,
        disconnect,
    };
};
