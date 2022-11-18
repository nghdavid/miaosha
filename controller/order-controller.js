require('dotenv').config();
const Order = require('../model/order-model');
const Queue = require('../model/queue-model');
const { STATUS } = require('../util/status');
const { generateOrderNum } = require('../util/order');

// checkout controller
const checkout = async (req, res, next) => {
    const { userId, price, productId } = req;
    const { phone, address } = req.body;
    const status = await Queue.getStatus(userId);
    if (Number(status) === STATUS.PAID) {
        return res.status(400).json({ error: '你已經買過了' });
    }
    if (Number(status) !== STATUS.SUCCESS) {
        return res.status(400).json({ error: '你沒有購買資格' });
    }
    const userData = await Order.getUserData(userId); // { name: 'david', email: 'test1@test.com' }
    const { name, email } = userData;
    const orderNum = generateOrderNum(1000000, 6);
    const payStatus = 1;
    await Promise.all([Queue.setStatus(userId, STATUS.PAID), Order.addTransaction()]);
    const checkoutResult = await Order.addOrder(userId, price, productId, phone, address, name, email, orderNum, payStatus);
    if (checkoutResult.error) {
        return res.status(400).json({ error: '購買失敗' });
    }
    return res.status(200).json({ message: '購買成功' });
};

module.exports = {
    checkout,
};
