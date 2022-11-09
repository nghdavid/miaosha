require('dotenv').config();
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const { TOKEN_SECRET, PAY_TOKEN_EXPIRE } = process.env;

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

/**
 * @param {*} id - User id
 * This function creates JWT token for payment
 * The payload includes user id and name and email and product id and price
 */
function issuePayJWT(payload) {
    const accessToken = jwt.sign(payload, TOKEN_SECRET, { expiresIn: PAY_TOKEN_EXPIRE });
    return accessToken;
}

module.exports = {
    socketAuth,
    issuePayJWT,
};
