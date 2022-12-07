require('dotenv').config();
const process = require('process');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const app = require('./consumer-app');
const { checkPayment } = require('./consumer/payment-queue');
const { consumer } = require('./consumer/people-queue');
const { socketAuth } = require('./util/auth');
const { pubClient, subClient } = require('./config/redis-cluster');
const httpServer = createServer(app);
const { CONSUMER_PORT_TEST, CONSUMER_PORT, NODE_ENV } = process.env;
const port = NODE_ENV == 'test' ? CONSUMER_PORT_TEST : CONSUMER_PORT;

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
const { lookup, disconnect } = require('./socket/standby-controller')(io);

io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    try {
        const user = await socketAuth(token);
        if (user instanceof Error) return next(new Error('登入錯誤！'));
        socket.data.userId = Number(user.id);
        socket.data.email = user.email;
        socket.data.name = user.name;
        next();
    } catch (error) {
        console.error(error);
        next(error);
    }
});

io.on('connection', async (socket) => {
    console.info(`user ${socket.data.userId} connected`);
    socket.join(socket.data.userId);
    socket.on('lookup', lookup);
    socket.on('disconnect', disconnect);
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
