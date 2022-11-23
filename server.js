require('dotenv').config();
const process = require('process');
const { createServer } = require('http');
// const { createAdapter } = require('@socket.io/redis-adapter');
const { Server } = require('socket.io');
const app = require('./app');
const httpServer = createServer(app);
// const { pubClient, subClient } = require('./config/redis-cluster');
const Cache = require('./config/redis-cluster').pubClient;
const ActivityClass = require('./util/activity');
const Activity = new ActivityClass();

const { PORT_TEST, PORT, NODE_ENV, DNS } = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;

const url = `${DNS}/miaosha.html`;
const password = 'th';

const io = new Server(httpServer, {
    cors: {
        // 在測試階段先用*即可
        // 等到有CDN時，在將origin轉成array形式，並加入CDN的域名
        // origin: ['https://stylish-test.click'],
        origin: '*',
        // methods: ['GET', 'POST'],
        // credentials: true,
    },
});
// io.adapter(createAdapter(pubClient, subClient));

io.on('connection', (socket) => {
    // console.log('a user connected');
    socket.emit('time', Activity.year, Activity.month, Activity.date, Activity.hour, Activity.minute);
    socket.on('disconnect', () => {
        // console.log('user disconnected');
    });
});

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});

Cache.on('ready', async () => {
    await Activity.setTime();
    setInterval(informUser, 50);
});

function informUser() {
    // console.log('Waiting');
    if (Activity.isStart()) {
        // console.log('Start!');
        io.emit('url', url, password);
    }
}
