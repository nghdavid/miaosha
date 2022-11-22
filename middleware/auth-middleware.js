const { TOKEN_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const { promisify } = require('util'); // util from native nodejs library

// 驗證使用者JWT的middleware
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (token == 'null') {
        return res.status(401).send({ error: 'Unauthorized' });
    }
    try {
        const payload = await promisify(jwt.verify)(token, TOKEN_SECRET);
        req.userId = payload.id;
        req.email = payload.email;
        req.name = payload.name;
        next();
    } catch (err) {
        return res.status(401).send({ error: '請重新登入' });
    }
};

module.exports = {
    auth,
};
