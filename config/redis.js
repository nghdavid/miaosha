/* eslint-disable object-shorthand */
/* eslint-disable func-names */
const Redis = require('ioredis');
require('dotenv').config(); // load database parameter
// const redis = new Redis();
const redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASS,
    showFriendlyErrorStack: true,
    retryStrategy: function () {
        const delay = 5; // Math.min(times * 50, 200);
        return delay;
        // if (times % 4 === 0) {
        //   console.error('Redis reconnect exhausted after 3 retries');
        //   return null;
        // }
        // return 200;
    },
});
redis.ready = false;
redis.on('ready', async () => {
    redis.ready = true;
    await redis.flushDb();
    console.log('Redis is ready');
});

// redis.connect().catch(() => {
//   console.error('Connection to redis failed');
// });
redis.on('error', async () => {
    redis.ready = false;
    console.error('Error in Redis');
    // redis.disconnect();
});
// const clearRedisDb = async () => {
//   console.debug('Cleaning Redis');
//   await redis.flushdb();
// };

// clearRedisDb(); // Clean Redis when an app initializes
module.exports = redis;
