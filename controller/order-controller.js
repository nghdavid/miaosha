require('dotenv').config();
const Order = require('../model/order-model');
const Queue = require('../model/queue-model');
const { STATUS } = require('../util/status');
const { generateOrderNum } = require('../util/order');

// checkout controller
const checkout = async (req, res, next) => {
    const { userId, price, productId } = req;
    const { phone, address } = req.body;
    const userData = await Order.getUserData(userId); // { name: 'david', email: 'test1@test.com' }
    const { name, email } = userData;
    const orderNum = generateOrderNum(1000000, 6);
    const status = 1;
    await Promise.all([Queue.setStatus(userId, STATUS.PAID), Order.addTransaction()]);
    const checkoutResult = await Order.addOrder(userId, price, productId, phone, address, name, email, orderNum, status);
    if (checkoutResult.error) {
        return res.status(500).json({ error: 'Payment fail' });
    }
    return res.status(200).json({ message: 'success' });
};

module.exports = {
    checkout,
};
