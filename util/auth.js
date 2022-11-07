require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { TOKEN_SECRET } = process.env;

async function socketAuth(accessToken) {
    accessToken = accessToken.replace('Bearer ', '');
    if (!accessToken || accessToken === 'null') {
        return new Error('請先登入！');
    }

    try {
        const user = await promisify(jwt.verify)(accessToken, TOKEN_SECRET);
        return user;
    } catch (err) {
        console.log('err', err);
        return new Error('請重新登入！');
    }
}

module.exports = {
    socketAuth,
};
