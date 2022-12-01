const Redis = require('ioredis');
require('dotenv').config();
const { CACHE_PORT, CACHE_HOST, CACHE_USER, CACHE_PASSWORD, STOCK } = process.env;

const redis = new Redis({
    port: CACHE_PORT,
    host: CACHE_HOST,
    username: CACHE_USER,
    password: CACHE_PASSWORD,
    showFriendlyErrorStack: true,
    retryStrategy: function () {
        const delay = 5;
        return delay;
    },
});

redis.ready = false;
redis.on('ready', async () => {
    redis.ready = true;
    console.log('Redis is ready');
});

redis.on('error', async () => {
    if (redis.ready) {
        console.error('Error in Redis');
        console.error('Redis lose connection');
    }
    redis.ready = false;
});

// ! Remember to comment out this function in production
const clearRedis = async () => {
    if (redis.ready) {
        console.warn('Cleaning Redis!!!');
        await redis.flushdb();
        console.warn('Setting stock!!!');
        await redis.set('stock', STOCK);
        console.warn('Setting transaction!!!');
        await redis.set('transaction', 0);
    }
};

const testRedisConnection = async () => {
    if (!redis.ready) {
        redis.connect().catch((err) => {
            console.log(err);
            console.log('redis connect fail');
        });
    }
};

setTimeout(testRedisConnection, 500);
setTimeout(clearRedis, 400);
module.exports = redis;
