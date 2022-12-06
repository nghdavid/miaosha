require('dotenv').config();
const Miaosha = require('../model/miaosha-model');
const MessageQueueService = require('../config/rabbitmq');
const MessageQueue = new MessageQueueService('people');
const { MAX_PEOPLE } = process.env;

// Connect to RabbitMQ
(async () => {
    try {
        await MessageQueue.connect();
    } catch (err) {
        console.error('Cannot connect to RabbitMQ');
        console.error(err);
    }
})();

const EXCHANGE_NAME = 'people_queue';
const QUEUE_NAME = 'people_queue';
// Miaosha controller
const miaosha = async (req, res, next) => {
    const { userId } = req;
    const people = await Miaosha.addPeople(); //增加排隊人數
    // 確認redis有無錯誤
    if (people.error) {
        next(people.error);
        return;
    }
    if (people > MAX_PEOPLE) {
        global.isFull = 1;
        console.info('The number of people in line is ', people);
        console.info('排隊人數已達上限');
        return res.status(200).json({ message: '秒殺已結束' });
    }
    await MessageQueue.publishToExchange(EXCHANGE_NAME, QUEUE_NAME, userId.toString());
    return res.status(200).json({ message: '秒殺請求已送出' });
};

module.exports = {
    miaosha,
};
