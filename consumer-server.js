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
const { STATUS } = require('./util/status');
const httpServer = createServer(app);
const { pubClient, subClient } = require('./config/redis-cluster');
const { CONSUMER_PORT_TEST, CONSUMER_PORT, NODE_ENV } = process.env;
const { socketAuth } = require('./util/auth');
const port = NODE_ENV == 'test' ? CONSUMER_PORT_TEST : CONSUMER_PORT;

let price;
let productId;
// Connect to Redis
(async () => {
    try {
        setTimeout(async () => {
            price = await Queue.getPrice();
            productId = await Queue.getProductId();
        }, 1000);
    } catch (err) {
        console.error('Cannot connect to Redis');
        console.error(err);
    }
})();

const io = new Server(httpServer, {
    cors: {
        // 在測試階段先用*即可
        // 等到有CDN時，在將origin轉成array形式，並加入CDN的域名
        // origin: ['https://stylish-test.click'],
        origin: '*',
        credentials: true,
    },
});
io.adapter(createAdapter(pubClient, subClient));

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const user = await socketAuth(token);
        if (user instanceof Error) return next(new Error('登入錯誤！'));
        socket.userId = user.id;
        socket.email = user.email;
        socket.name = user.name;
        next();
    } catch (err) {
        console.error(err);
        next(err);
    }
});

io.on('connection', async (socket) => {
    console.log('a user connected');
    console.log('user id is ', socket.userId);
    console.log('user email is ', socket.email);
    console.log('user name is ', socket.name);
    console.log('');
    socket.join(socket.userId);
    let status = await Queue.getStatus(socket.userId);
    if (status !== null) {
        console.debug('使用者來詢問了');
        // 代表使用者有成功送出搶購請求
        status = Number(status);
        if (status === STATUS.SUCCESS) {
            console.debug('你有搶購成功喔');
            io.to(socket.userId).emit('notify', STATUS.SUCCESS);
            const accessToken = issuePayJWT({
                id: socket.userId,
                name: socket.name,
                email: socket.email,
                price,
                productId,
            });
            io.to(socket.userId).emit('jwt', accessToken);
        } else {
            io.to(socket.userId).emit('notify', status);
        }
    }
    socket.on('disconnect', () => {
        console.log('user disconnected');
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
