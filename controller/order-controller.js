require('dotenv').config();
// const Order = require('../model/order-model');

// checkout controller
const checkout = async (req, res, next) => {
    const { userId, price, produceId, name, email } = req;
    return res.status(200).json({ message: 'success' });
};

module.exports = {
    checkout,
};
