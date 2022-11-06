require('dotenv').config();
const Redis = require('ioredis');

const { REDIS_PORT_1, REDIS_HOST_1, REDIS_USERNAME_1, REDIS_PASSWORD_1, REDIS_PORT_2, REDIS_HOST_2, REDIS_USERNAME_2, REDIS_PASSWORD_2, STOCK } = process.env;

const pubClient = new Redis.Cluster([
    {
        port: REDIS_PORT_1,
        host: REDIS_HOST_1,
        username: REDIS_USERNAME_1,
        password: REDIS_PASSWORD_1,
    },
    {
        port: REDIS_PORT_2,
        host: REDIS_HOST_2,
        username: REDIS_USERNAME_2,
        password: REDIS_PASSWORD_2,
    },
]);

pubClient.ready = false;
const subClient = pubClient.duplicate();

pubClient.on('ready', () => {
    pubClient.ready = true;
    console.log('Redis is ready');
});

pubClient.on('error', (error) => {
    if (pubClient.ready) {
        console.error('Error in Redis');
        console.error('Redis lose connection');
        console.error(error);
    }
    pubClient.ready = false;
});

// ! Remember to comment out this function in production
const clearRedis = async () => {
    if (pubClient.ready) {
        console.warn('Cleaning Redis!!!');
        await pubClient.flushdb();
        console.warn('Setting stock!!!');
        await pubClient.set('stock', STOCK);
        console.warn('Setting transaction!!!');
        await pubClient.set('transaction', 0);
    }
};

const testRedisConnection = async () => {
    if (!pubClient.ready) {
        pubClient.connect().catch((err) => {
            console.log(err);
            console.log('redis connect fail');
        });
    }
};

// setTimeout(testRedisConnection, 500);
// setTimeout(clearRedis, 400);

module.exports = {
    pubClient,
    subClient,
};
