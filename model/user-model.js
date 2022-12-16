require('dotenv').config();
const bcrypt = require('bcrypt');
const { db, readDb } = require('../config/mysql');
const salt = parseInt(process.env.BCRYPT_SALT);
const { TOKEN_EXPIRE, TOKEN_SECRET } = process.env; // 30 days by seconds
const jwt = require('jsonwebtoken');

const USER_ROLE = {
    ALL: -1,
    ADMIN: 1,
    USER: 2,
};

const signUp = async (name, roleId, email, password) => {
    const conn = await db.getConnection();
    try {
        const user = {
            role_id: roleId,
            email: email,
            password: bcrypt.hashSync(password, salt),
            name: name,
        };
        const queryStr = 'INSERT INTO user SET ?';
        const [result] = await conn.query(queryStr, user);
        const accessToken = jwt.sign(
            {
                id: result.insertId,
                name: user.name,
                email: user.email,
            },
            TOKEN_SECRET,
            { expiresIn: TOKEN_EXPIRE }
        );
        user.access_token = accessToken;
        user.id = result.insertId;
        return { user };
    } catch (error) {
        return {
            error: 'Email Already Exists',
            status: 403,
        };
    } finally {
        await conn.release();
    }
};

const nativeSignIn = async (email, password) => {
    const conn = await db.getConnection();
    try {
        await conn.query('START TRANSACTION');

        const [users] = await conn.query('SELECT * FROM user WHERE email = ?', [email]);
        const user = users[0];
        if (!bcrypt.compareSync(password, user.password)) {
            await conn.query('COMMIT');
            return { error: 'Password is wrong' };
        }

        const accessToken = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            TOKEN_SECRET,
            { expiresIn: TOKEN_EXPIRE }
        );

        await conn.query('COMMIT');
        user.access_token = accessToken;
        return { user };
    } catch (error) {
        await conn.query('ROLLBACK');
        return { error };
    } finally {
        await conn.release();
    }
};

const getUserDetail = async (email) => {
    try {
        const [users] = await readDb.query('SELECT * FROM user WHERE email = ?', [email]);
        return users[0];
    } catch (error) {
        return null;
    }
};

module.exports = {
    USER_ROLE,
    signUp,
    nativeSignIn,
    getUserDetail,
};
