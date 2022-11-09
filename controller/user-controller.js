const User = require('../model/user-model');
const validator = require('validator');

const signUp = async (req, res) => {
    let { name } = req.body;
    const { email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Request Error: name, email and password are required.' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: 'Request Error: Invalid email format' });
    }

    name = validator.escape(name);

    const result = await User.signUp(name, User.USER_ROLE.USER, email, password);
    if (result.error) {
        return res.status(403).json({ error: result.error });
    }

    const user = result.user;
    if (!user) {
        return res.status(500).json({ error: 'Database Query Error' });
    }

    return res.status(200).json({
        data: {
            access_token: user.access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        },
    });
};
const getUserProfile = async (req, res) => {
    res.status(200).send({
        data: {
            provider: req.user.provider,
            name: req.user.name,
            email: req.user.email,
            picture: req.user.picture,
        },
    });
    return;
};

const signIn = async (req, res) => {
    const data = req.body;

    let result = await nativeSignIn(data.email, data.password);

    if (result.error) {
        const status_code = result.status ? result.status : 403;
        return res.status(status_code).send({ error: result.error });
    }

    const user = result.user;
    if (!user) {
        return res.status(500).send({ error: 'Database Query Error' });
    }

    return res.status(200).send({
        data: {
            access_token: user.access_token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
        },
    });
};

const nativeSignIn = async (email, password) => {
    if (!email || !password) {
        return { error: 'Request Error: email and password are required.', status: 400 };
    }

    try {
        return await User.nativeSignIn(email, password);
    } catch (error) {
        return { error };
    }
};

module.exports = {
    signUp,
    signIn,
    getUserProfile,
};
