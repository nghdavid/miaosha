const Cache = require('../config/redis');
const CACHE_USER_KEY = 'id:';
const CACHE_STOCK_KEY = 'stock';

/**
 * * This function get user status from cache
 * * User key is like id:1 (if id = 1)
 * * status -1 means 搶購失敗
 * * status 0 means 候補
 * * status 1 means 搶購成功
 * * status 2 means paid successfully
 */
const getStatus = async (id) => {
    try {
        if (Cache.ready) {
            const status = await Cache.get(`${CACHE_USER_KEY}${id}`);
            return status;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getStatus model');
        console.error(err);
        return { error: 'Redis Error: getStatus model' };
    }
};

/**
 * * This function set user status in cache
 * * User key is like id:1 (if id = 1)
 */
const setStatus = async (id, status) => {
    try {
        if (Cache.ready) {
            await Cache.set(`${CACHE_USER_KEY}${id}`, status);
            return;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getStatus model');
        console.error(err);
        return { error: 'Redis Error: getStatus model' };
    }
};

/**
 * * This function add 'stock' (+=1) in cache
 */
const addStock = async () => {
    try {
        if (Cache.ready) {
            const stock = await Cache.incr(CACHE_STOCK_KEY);
            return stock;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in addStock model');
        console.error(err);
        return { error: 'Redis Error: addStock model' };
    }
};

/**
 * * This function minus 'stock' (-=1) in cache
 */
const decrStock = async () => {
    try {
        if (Cache.ready) {
            const stock = await Cache.decr(CACHE_STOCK_KEY);
            return stock;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in decrStock model');
        console.error(err);
        return { error: 'Redis Error: decrStock model' };
    }
};

module.exports = {
    getStatus,
    addStock,
    decrStock,
    setStatus,
};
