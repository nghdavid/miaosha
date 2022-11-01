/* eslint-disable object-shorthand */
/* eslint-disable func-names */
const Redis = require('ioredis');
require('dotenv').config();
const { CACHE_PORT, CACHE_HOST, CACHE_USER, CACHE_PASSWORD } = process.env;
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
        console.error('Redis connection error');
    }
    redis.ready = false;
});

const clearRedisDb = async () => {
    console.warn('Cleaning Redis');
    await redis.flushdb();
};
clearRedisDb(); // Clean Redis when an app initializes
module.exports = redis;
