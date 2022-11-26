const validator = require('validator');
const Cache = require('../config/redis-cluster').pubClient;
const answers = { 1: 'A', 2: 'B', 3: 'C', 4: 'D', 5: 'E' };
const ActivityClass = require('../util/activity');
const Activity = new ActivityClass();
global.isFull = 0;
Cache.on('ready', async () => {
    await Activity.setTime();
});

const validateMiaosha = async (req, res, next) => {
    if (global.isFull) {
        return res.status(400).json({ message: '秒殺已結束' });
    }
    if (!Activity.isStart()) {
        return res.status(400).json({ error: 'Activity has not started yet' });
    }
    if (Activity.isEnd()) {
        return res.status(400).json({ error: 'Activity is over' });
    }
    const { id, answer, question } = req.body;
    if (!id || !answer || !question || validator.isEmpty(answer)) {
        return res.status(400).json({ error: 'id or answer or question missed' });
    }
    if (id <= 0 || !Number.isInteger(id)) {
        return res.status(400).json({ error: 'Id is wrong' });
    }
    if (question <= 0 || !answers.hasOwnProperty(question)) {
        return res.status(400).json({ error: 'Question is wrong' });
    }
    if (answer === answers[question]) {
        req.userId = id;
        next();
    } else {
        return res.status(400).json({ error: 'Answer is wrong' });
    }
};

module.exports = {
    validateMiaosha,
};
