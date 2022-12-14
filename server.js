require('dotenv').config();
const process = require('process');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const httpServer = createServer(app);
const Cache = require('./config/redis-cluster').pubClient;
const ActivityClass = require('./util/activity');
const Activity = new ActivityClass();

const { PORT_TEST, PORT, NODE_ENV, DNS, WHITE_LIST } = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;

const url = `${DNS}/miaosha.html`;
const password = 'th';

const io = new Server(httpServer, {
    cors: {
        // 在測試階段先用*即可
        // origin: '*',
        // 等到有CDN時，在將origin轉成array形式，並加入CDN的域名
        origin: [WHITE_LIST],
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    socket.emit('time', Activity.year, Activity.month, Activity.date, Activity.hour, Activity.minute, Activity.second);
});

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});

Cache.on('ready', async () => {
    await Activity.setTime();
    setInterval(informUser, 50);
});

function informUser() {
    if (Activity.isStart()) {
        io.emit('url', url, password);
    }
}
