const { db, readDb } = require('../config/mysql');
const Cache = require('../config/redis-cluster').pubClient;
const CACHE_TRANSACTION_KEY = 'transaction';

/**
 * @param {*} userId - user id
 *
 * * This function finds user's name and email
 *
 */
const getUserData = async (userId) => {
    try {
        const sql = 'SELECT name, email FROM user WHERE id = ?';
        const queryParams = [userId];
        const [userData] = await readDb.execute(sql, queryParams);
        if (userData.length === 0) {
            return { error: 'Cannot find this user' };
        }
        return userData[0];
        // userData = [{name: 'david',email:'test@test.com'}]
    } catch (err) {
        console.error('Error happen in getUserData model');
        console.error(err);
        return { error: 'DB Error: getUserData model' };
    }
};

/**
 *
 * * This function creates order
 *
 */
const addOrder = async (userId, price, productId, phone, address, name, email, orderNum, status) => {
    const conn = await db.getConnection();
    try {
        await conn.query('START TRANSACTION');
        const sql = 'INSERT INTO miaosha_orders (user_id, price, miaosha_id, phone, address, name, email, order_num, status) VALUES (?,?,?,?,?,?,?,?,?)';
        const queryParams = [userId, price, productId, phone, address, name, email, orderNum, status];
        await conn.execute(sql, queryParams);
        await conn.query('COMMIT');
        return { message: 'Successfully pay' };
    } catch (err) {
        await conn.query('ROLLBACK');
        console.error('Transaction fails');
        console.error(err);
        return { error: 'DB Error: addOrder model' };
    } finally {
        conn.release();
    }
};

/**
 * * This function add 'transaction' (+=1) in cache
 */
const addTransaction = async () => {
    try {
        if (Cache.ready) {
            const transaction = await Cache.incr(CACHE_TRANSACTION_KEY);
            return transaction;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in addTransaction model');
        console.error(err);
        return { error: 'Redis Error: addTransaction model' };
    }
};

module.exports = {
    getUserData,
    addOrder,
    addTransaction,
};
