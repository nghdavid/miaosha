const validator = require('validator');
const answers = { 1: 'a', 2: 'a', 3: 'a', 4: 'a', 5: 'a' };
const validateMiaosha = async (req, res, next) => {
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
