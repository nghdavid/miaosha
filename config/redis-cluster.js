const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const Redis = require('ioredis');

const { REDIS_PORT_1, REDIS_HOST_1, REDIS_USERNAME_1, REDIS_PASSWORD_1, REDIS_PORT_2, REDIS_HOST_2, REDIS_USERNAME_2, REDIS_PASSWORD_2 } = process.env;

const pubClient = new Redis.Cluster(
    [
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
    ],
    {
        enableReadyCheck: true,
        clusterRetryStrategy: function () {
            const delay = 5;
            return delay;
        },
        maxRetriesPerRequest: 10,
        showFriendlyErrorStack: true,
    }
);

pubClient.ready = false;
const subClient = pubClient.duplicate();

pubClient.on('ready', () => {
    if (!pubClient.ready) {
        console.log('Redis cluster is ready');
        pubClient.ready = true;
    }
});

pubClient.on('error', (error) => {
    if (pubClient.ready) {
        console.error('Error in Redis');
        console.error('Redis lose connection');
        console.error(error);
    }
    pubClient.ready = false;
});

const testRedisConnection = async () => {
    if (!pubClient.ready) {
        console.info('Testing connection');
        pubClient.connect().catch((err) => {
            console.error(err);
            console.error('redis cluster connect fail');
        });
    }
};

// setTimeout(testRedisConnection, 1000);

module.exports = {
    pubClient,
    subClient,
};
