require('dotenv').config();
const process = require('process');
const { DateTime } = require('luxon');
const { createServer } = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const httpServer = createServer(app);

const { PORT_TEST, PORT, NODE_ENV, TIME_ZONE_DIFF } = process.env;
const port = NODE_ENV == 'test' ? PORT_TEST : PORT;
if (TIME_ZONE_DIFF === undefined) {
    console.error('No env');
    process.exit(0);
}
const YEAR = process.argv[2];
const MONTH = process.argv[3];
const Date = process.argv[4];
const HOUR = process.argv[5];
const MINUTE = process.argv[6];

const timeZoneDiff = Number(TIME_ZONE_DIFF);
const startTime = DateTime.local(Number(YEAR), Number(MONTH), Number(Date), Number(HOUR - timeZoneDiff), Number(MINUTE)).setZone('Asia/Taipei');
const url = 'https://www.youtube.com/';
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
    const now = DateTime.now().setZone('Asia/Taipei');
    // console.log('Waiting');
    if (now > startTime) {
        // console.log('Start!');
        io.emit('url', url, password);
    }
}
let timer;
io.on('connection', (socket) => {
    console.log('a user connected');
    informUser();
    if (timer !== undefined) {
        clearInterval(timer);
    }
    timer = setInterval(informUser, 50);
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
// 可以把setInterval(informUser, 50)移出來

httpServer.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});
