require('dotenv').config();
const process = require('process');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const httpServer = createServer(app);
const ActivityClass = require('./util/activity');
const Activity = new ActivityClass();

const { PORT_TEST, PORT, NODE_ENV } = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;

const url = 'http://localhost:3000/miaosha.html';
const password = 'th';

const io = new Server(httpServer, {
    cors: {
        // 在測試階段先用*即可
        // 等到有CDN時，在將origin轉成array形式，並加入CDN的域名
        // origin: ['https://stylish-test.click'],
        origin: '*',
        credentials: true,
    },
});

function informUser() {
    // console.log('Waiting');
    if (Activity.isStart()) {
        // console.log('Start!');
        io.emit('url', url, password);
    }
}

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('time', Activity.year, Activity.month, Activity.date, Activity.hour, Activity.minute);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
setInterval(informUser, 50);
