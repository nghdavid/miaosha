const Queue = require('../model/queue-model');
const { STATUS } = require('../util/status');

// prize controller
const prize = async (req, res, next) => {
    const status = await Queue.getStatus(req.userId);
    if (status !== null && status.error) {
        return res.status(400).json({ error: '您尚未搶購過，請稍後再參加搶購' });
    }
    if (status === null) {
        return res.status(400).json({ error: '您尚未搶購過，請先參加搶購' });
    }
    if (Number(status) !== STATUS.PAID) {
        return res.status(400).json({ error: '您還沒購買到戰利品，請先完成搶購' });
    }
    return res.status(200).json({ message: '恭喜您搶到戰利品' });
};

module.exports = { prize };
