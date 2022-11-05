require('dotenv').config();
const process = require('process');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./consumer-app');
const { checkPayment } = require('./consumer/payment-queue');
const { consumer } = require('./consumer/people-queue');
const httpServer = createServer(app);

const { CONSUMER_PORT_TEST, CONSUMER_PORT, NODE_ENV } = process.env;

const port = NODE_ENV == 'test' ? CONSUMER_PORT_TEST : CONSUMER_PORT;

const io = new Server(httpServer, {
    cors: {
        // 在測試階段先用*即可
        // 等到有CDN時，在將origin轉成array形式，並加入CDN的域名
        // origin: ['https://stylish-test.click'],
        origin: '*',
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.join(1);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});

consumer(io);
checkPayment(io);
