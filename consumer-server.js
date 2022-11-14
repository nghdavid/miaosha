require('dotenv').config();
const process = require('process');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const app = require('./consumer-app');
const { checkPayment } = require('./consumer/payment-queue');
const { consumer } = require('./consumer/people-queue');
const { issuePayJWT } = require('./util/auth');
const Queue = require('./model/queue-model');
const Cache = require('./config/redis-cluster').pubClient;
const { STATUS } = require('./util/status');
const { socketAuth } = require('./util/auth');
const httpServer = createServer(app);
const { pubClient, subClient } = require('./config/redis-cluster');
const { CONSUMER_PORT_TEST, CONSUMER_PORT, NODE_ENV, CHECKOUT_PROCESS_TIME, TIME_LIMIT, PAY_TOKEN_EXPIRE } = process.env;
let waitTime = TIME_LIMIT * 60 - CHECKOUT_PROCESS_TIME * 60 - PAY_TOKEN_EXPIRE / 1000; // 使用者過了這段時間就不能拿到jwt了
const port = NODE_ENV == 'test' ? CONSUMER_PORT_TEST : CONSUMER_PORT;

let price;
let productId;
// Connect to Redis
Cache.on('ready', async () => {
    price = await Queue.getPrice();
    productId = await Queue.getProductId();
});

const io = new Server(httpServer, {
    cors: {
        // 在測試階段先用*即可
        // 等到有CDN時，在將origin轉成array形式，並加入CDN的域名
        // origin: ['https://stylish-test.click'],
        origin: '*',
        // credentials: true,
    },
});
io.adapter(createAdapter(pubClient, subClient));

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const user = await socketAuth(token);
        if (user instanceof Error) return next(new Error('登入錯誤！'));
        socket.data.userId = user.id;
        socket.data.email = user.email;
        socket.data.name = user.name;
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

io.on('connection', async (socket) => {
    console.info(`user ${socket.data.userId} connected`);
    socket.join(socket.data.userId);
    let status = await Queue.getStatus(socket.data.userId);
    if (status !== null) {
        console.debug('使用者來詢問了');
        // 代表使用者有成功送出搶購請求
        status = Number(status);
        if (status === STATUS.SUCCESS) {
            const successTime = await Queue.getSuccessTime(socket.data.userId); // Consumer判定此user搶購成功的時間
            const now = Math.round(Date.now() / 1000); // 現在的時間
            // 判定使用者過了多久才來查詢結果，如果拖太久才來(超過waiting time)，那就判定搶購失敗。
            if (now - successTime < waitTime) {
                console.debug('你有搶購成功喔');
                io.to(socket.data.userId).emit('notify', STATUS.SUCCESS);
                const accessToken = issuePayJWT({
                    id: socket.data.userId,
                    name: socket.data.name,
                    email: socket.data.email,
                    price,
                    productId,
                });
                io.to(socket.data.userId).emit('jwt', accessToken);
            } else {
                io.to(socket.data.userId).emit('notify', STATUS.FAIL);
            }
        } else {
            io.to(socket.data.userId).emit('notify', status);
        }
    }
    socket.on('disconnect', () => {
        console.info(`user ${socket.data.userId} disconnected`);
    });
});

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});

try {
    // Consumer
    consumer(io);
    checkPayment(io);
} catch (err) {
    console.error(err);
}
