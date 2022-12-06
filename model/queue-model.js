const Cache = require('../config/redis-cluster').pubClient;
const CACHE_USER_KEY = 'id:';
const CACHE_STOCK_KEY = 'stock';
const CACHE_TRANSACTION_KEY = 'transaction';
const CACHE_STANDBY_KEY = 'standby';
const CACHE_SUCCESS_KEY = 'success_pay';
const CACHE_PRICE_KEY = 'price';
const CACHE_PRODUCT_ID_KEY = 'product_id';
const CACHE_SUCCESS_TIME_KEY = 'success_time';
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
 * * This function gets product price
 *
 */
const getPrice = async () => {
    try {
        if (Cache.ready) {
            const price = await Cache.get(CACHE_PRICE_KEY);
            return Number(price);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getPrice model');
        console.error(err);
        return { error: 'Redis Error: getPrice model' };
    }
};

/**
 * * This function gets product id
 *
 */
const getProductId = async () => {
    try {
        if (Cache.ready) {
            const productId = await Cache.get(CACHE_PRODUCT_ID_KEY);
            return Number(productId);
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getProductId model');
        console.error(err);
        return { error: 'Redis Error: getProductId model' };
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

/**
 *
 * @param {*} queueName - The name of message queue
 * @param {*} message - Message from producer
 *
 * * This function insert message into queue
 *
 */
const enqueue = async (queueName, message) => {
    try {
        if (Cache.ready) {
            await Cache.lpush(queueName, message);
            return 1;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in enqueue model');
        console.error(err);
        return { error: 'enqueue failed' };
    }
};

/**
 *
 * @param {*} queueName - The name of message queue
 *
 * * This function pop one value from queue
 *
 */
const dequeue = async (queueName) => {
    try {
        if (Cache.ready) {
            const popMessage = await Cache.rpop(queueName);
            return popMessage;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in dequeue model');
        console.error(err);
        return { error: 'dequeue failed' };
    }
};

/**
 * * This function get how many orders are paid
 */
const getTransaction = async () => {
    try {
        if (Cache.ready) {
            const transaction = await Cache.get(`${CACHE_TRANSACTION_KEY}`);
            return transaction;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getTransaction model');
        console.error(err);
        return { error: 'Redis Error: getTransaction model' };
    }
};

/**
 * * This function get who are in standby list
 */
const getStandbyList = async () => {
    try {
        if (Cache.ready) {
            const list = await Cache.lrange(`${CACHE_STANDBY_KEY}`, 0, -1);
            return list;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in getStandbyList model');
        console.error(err);
        return { error: 'Redis Error: getStandbyList model' };
    }
};

/**
 * * This function delete standby list
 */
const deleteStandby = async () => {
    try {
        if (Cache.ready) {
            await Cache.del(`${CACHE_STANDBY_KEY}`);
            return;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in deleteStandby model');
        console.error(err);
        return { error: 'Redis Error: deleteStandby model' };
    }
};

/**
 * * This function add 'success_pay' (+=1) in cache
 */
const addSuccessPayment = async () => {
    try {
        if (Cache.ready) {
            const payment = await Cache.incr(CACHE_SUCCESS_KEY);
            return payment;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in addSuccessPayment model');
        console.error(err);
        return { error: 'Redis Error: addSuccessPayment model' };
    }
};

/**
 * @param {*} id - user id
 * @param {*} time - when user succeed (sec)
 *
 * * This function saves when user succeed
 *
 */
const saveSuccessTime = async (id, time) => {
    try {
        const result = await Cache.hsetnx(CACHE_SUCCESS_TIME_KEY, `${CACHE_USER_KEY}${id}`, time);
        // 檢查是否已經存過這個使用者的issue time
        if (!result) {
            console.warn(`User ${id} field already exist in ${CACHE_SUCCESS_TIME_KEY}`);
        }
    } catch (err) {
        console.error('Error happen in saveJwtTime model');
        console.error(err);
        return { error: 'DB Error: saveJwtTime model' };
    }
};

/**
 * @param {*} id - user id
 *
 * * This function return when user succeed (sec)
 *
 */
const getSuccessTime = async (id) => {
    try {
        const time = await Cache.hget(CACHE_SUCCESS_TIME_KEY, `${CACHE_USER_KEY}${id}`);
        return time;
    } catch (err) {
        console.error('Error happen in saveJwtTime model');
        console.error(err);
        return { error: 'DB Error: saveJwtTime model' };
    }
};

module.exports = {
    getStatus,
    addStock,
    decrStock,
    getTransaction,
    setStatus,
    enqueue,
    dequeue,
    getPrice,
    getStandbyList,
    addSuccessPayment,
    deleteStandby,
    getProductId,
    saveSuccessTime,
    getSuccessTime,
};
