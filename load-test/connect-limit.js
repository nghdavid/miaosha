const { io } = require('socket.io-client');

const URL = 'https://publisher.miaosha.click';
// const URL = 'http://localhost:3000';

const MAX_CLIENTS = 60000;
const CLIENT_CREATION_INTERVAL_IN_MS = 3;

let clientCount = 0;
let numUrl = 0;
let numConnection = 0;
let numCreateCLient = 0;
let interval = setInterval(createClient, CLIENT_CREATION_INTERVAL_IN_MS);
const start = new Date().getTime();

async function createClient() {
    clientCount++;
    if (clientCount > MAX_CLIENTS) {
        return clearInterval(interval);
    }

    const socket = io(URL, {
        transports: ['websocket'],
    });
    numCreateCLient++;
    if (numCreateCLient % 1000 === 0) {
        console.log(`Num of Create Client is ${numCreateCLient}`);
    }
    if (numCreateCLient >= MAX_CLIENTS) {
        console.log('All clients are created');
    }
    socket.on('connect', () => {
        numConnection++;
        if (numConnection % 1000 === 0 || numConnection > 45000) {
            if (numConnection % 10 === 0) {
                console.log(`Num of Successful Connection is ${numConnection}`);
            }
        }
        if (numConnection === MAX_CLIENTS) {
            const duration = new Date().getTime() - start;
            console.log('All users connect to servers');
            console.log(`Each connection takes ${duration / MAX_CLIENTS} ms`);
        }
    });

    socket.on('url', (url, password) => {
        numUrl++;
        socket.disconnect();
    });

    socket.on('disconnect', (reason) => {
        if (numUrl % 1000 === 0) {
            console.log(`Num of url received is ${numUrl}`);
        }
        if (numUrl >= MAX_CLIENTS) {
            console.log('All connected clients received urls');
            process.exit(0);
        }
    });
}

createClient();
