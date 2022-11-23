require('dotenv').config();
const { MAX_PEOPLE } = process.env;
const Miaosha = require('../model/miaosha-model');
const MessageQueueService = require('../config/rabbitmq');
const MessageQueue = new MessageQueueService('people');

// Connect to RabbitMQ
(async () => {
    try {
        await MessageQueue.connect();
    } catch (err) {
        console.error('Cannot connect to RabbitMQ');
        console.error(err);
    }
})();

// let isFull = 0; //排隊隊伍是否過長
const EXCHANGE_NAME = 'people_queue';
const QUEUE_NAME = 'people_queue';
// Miaosha controller
const miaosha = async (req, res, next) => {
    const { userId } = req;
    // if (isFull) {
    //     return res.status(200).json({ message: '秒殺已結束' });
    // }
    const people = await Miaosha.addPeople(); //增加排隊人數
    // 確認redis有無錯誤
    if (people.error) {
        next(people.error);
        return;
    }
    console.info('The number of people in line is ', people);
    await MessageQueue.publishToExchange(EXCHANGE_NAME, QUEUE_NAME, userId.toString());
    if (people >= MAX_PEOPLE) {
        // isFull = 1;
        global.isFull = 1;
        console.info('排隊人數已達上限');
    }
    return res.status(200).json({ message: '秒殺請求已送出' });
};

// Template controller
// const template = async (req, res, next) => {
// const result = await Test.template();
//   if (result.error) {
//     next(result.error);
//     return;
//   }
// };
module.exports = {
    miaosha,
};
