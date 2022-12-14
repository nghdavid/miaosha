const Cache = require('../config/redis-cluster').pubClient;

const CACHE_YEAR_KEY = 'year';
const CACHE_MONTH_KEY = 'month';
const CACHE_DATE_KEY = 'date';
const CACHE_HOUR_KEY = 'hour';
const CACHE_MINUTE_KEY = 'minute';
const CACHE_SECOND_KEY = 'second';
const CACHE_NUM_CONSUMER_KEY = 'num_consumer';
const CACHE_CONSUMERS_KEY = 'consumers';
const CACHE_PAY_CONSUMERS_KEY = 'pay_consumers';

/**
 * * This function gets start time (year)
 *
 */
const getYear = async () => {
    try {
        if (Cache.ready) {
            const year = await Cache.get(CACHE_YEAR_KEY);
            return Number(year);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getYear model');
        console.error(err);
        return { error: 'Redis Error: getYear model' };
    }
};

/**
 * * This function gets start time (hour)
 *
 */
const getHour = async () => {
    try {
        if (Cache.ready) {
            const hour = await Cache.get(CACHE_HOUR_KEY);
            return Number(hour);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getHour model');
        console.error(err);
        return { error: 'Redis Error: getHour model' };
    }
};

/**
 * * This function gets start time (month)
 *
 */
const getMonth = async () => {
    try {
        if (Cache.ready) {
            const month = await Cache.get(CACHE_MONTH_KEY);
            return Number(month);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getMonth model');
        console.error(err);
        return { error: 'Redis Error: getMonth model' };
    }
};

/**
 * * This function gets start time (date)
 *
 */
const getDate = async () => {
    try {
        if (Cache.ready) {
            const date = await Cache.get(CACHE_DATE_KEY);
            return Number(date);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getDate model');
        console.error(err);
        return { error: 'Redis Error: getDate model' };
    }
};

/**
 * * This function gets start time (min)
 *
 */
const getMinute = async () => {
    try {
        if (Cache.ready) {
            const minute = await Cache.get(CACHE_MINUTE_KEY);
            return Number(minute);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getMinute model');
        console.error(err);
        return { error: 'Redis Error: getMinute model' };
    }
};

/**
 * * This function gets start time (sec)
 *
 */
const getSecond = async () => {
    try {
        if (Cache.ready) {
            const second = await Cache.get(CACHE_SECOND_KEY);
            return Number(second);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getSecond model');
        console.error(err);
        return { error: 'Redis Error: getSecond model' };
    }
};

/**
 * * This function gets number consumer
 *
 */
const getNumConsumer = async () => {
    try {
        if (Cache.ready) {
            const numConsumer = await Cache.get(CACHE_NUM_CONSUMER_KEY);
            return Number(numConsumer);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getNumConsumer model');
        console.error(err);
        return { error: 'Redis Error: getNumConsumer model' };
    }
};

/**
 * * This function gets consumer num from redis set (consumers)
 * * ????????????consumer???????????????
 */
const getConsumer = async () => {
    try {
        if (Cache.ready) {
            const consumer = await Cache.spop(CACHE_CONSUMERS_KEY);
            return Number(consumer);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getConsumer model');
        console.error(err);
        return { error: 'Redis Error: getConsumer model' };
    }
};

/**
 * * This function gets pay consumer num from redis set (pay_consumers)
 * * ????????????pay consumer???????????????
 */
const getPayConsumer = async () => {
    try {
        if (Cache.ready) {
            const consumer = await Cache.spop(CACHE_PAY_CONSUMERS_KEY);
            return Number(consumer);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getPayConsumer model');
        console.error(err);
        return { error: 'Redis Error: getPayConsumer model' };
    }
};

module.exports = {
    getYear,
    getMonth,
    getConsumer,
    getPayConsumer,
    getNumConsumer,
    getMinute,
    getSecond,
    getDate,
    getHour,
};
