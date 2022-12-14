require('dotenv').config();
const { SendMessageCommand } = require('@aws-sdk/client-sqs');
const { sqsClient } = require('../util/sqsClient.js');
const Order = require('../model/order-model');
const Queue = require('../model/queue-model');
const { STATUS } = require('../util/status');
const { generateOrderNum } = require('../util/order');
const { STOCK, QUEUE_URL } = process.env;

const params = {
    MessageAttributes: {
        name: {
            DataType: 'String',
        },
        email: {
            DataType: 'String',
        },
    },
    MessageBody: 'Send email',
    QueueUrl: QUEUE_URL,
};

const sendSQS = async (name, email) => {
    try {
        params.MessageAttributes.name.StringValue = name;
        params.MessageAttributes.email.StringValue = email;
        const data = await sqsClient.send(new SendMessageCommand(params));
        console.info('Success SQS message sent. MessageID:', data.MessageId);
        return data; // For unit tests.
    } catch (err) {
        console.log('Error', err);
    }
};

// checkout controller
const checkout = async (req, res, next) => {
    const { userId, price, productId } = req;
    const { phone, address } = req.body;

    const status = await Queue.getStatus(userId);
    if (Number(status) === STATUS.PAID) {
        return res.status(400).json({ error: '你已經買過了' });
    }
    if (Number(status) !== STATUS.SUCCESS) {
        console.warn(`User-${userId}來結帳但沒購買資格，狀態為${Number(status)}}`);
        return res.status(400).json({ error: '你沒有購買資格' });
    }

    // 寫入訂單
    const userData = await Order.getUserData(userId); // { name: 'david', email: 'test1@test.com' }
    const { name, email } = userData;
    const orderNum = generateOrderNum(1000000, 6);
    const payStatus = 1;
    const checkoutResult = await Order.addOrder(userId, price, productId, phone, address, name, email, orderNum, payStatus);
    if (checkoutResult.error) {
        return res.status(400).json({ error: '購買失敗' });
    }

    await Queue.setStatus(userId, STATUS.PAID);
    const numTransaction = await Order.addTransaction();

    // 若完成交易數 >=庫存數，將所有候補者的狀態改為失敗
    if (numTransaction >= STOCK) {
        await changeStandbyFail();
    }

    // Send email and name to SQS
    await sendSQS(name, email);
    return res.status(200).json({ message: '購買成功' });
};

async function changeStandbyFail() {
    const standbyList = await Queue.getStandbyList();
    if (standbyList.length > 0) {
        const totalFailSets = standbyList.map((id) => {
            console.info(`User-${id}搶購失敗`);
            // 將使用者的狀態改為失敗
            return Queue.setStatus(id, STATUS.FAIL);
        });
        await Promise.all(totalFailSets);
    }
    console.info('庫存已全部賣完!!!!!!');
}

module.exports = {
    checkout,
};
