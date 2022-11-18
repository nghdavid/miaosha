const { PAY_TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // util from native nodejs library

// 驗證結帳JWT的middleware
const authCheckout = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (token == 'null') {
        return res.status(401).send({ error: 'Unauthorized' });
    }
    try {
        const payload = await promisify(jwt.verify)(token, PAY_TOKEN_SECRET);
        req.userId = payload.id;
        req.price = payload.price;
        req.productId = payload.productId;
        next();
    } catch (err) {
        return res.status(401).send({ error: '付款期限已到' });
    }
};

module.exports = {
    authCheckout,
};
