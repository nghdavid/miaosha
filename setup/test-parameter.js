const Cache = require('../config/redis-cluster').pubClient;
const { STOCK } = process.env;
const { DateTime } = require('luxon');
const DELAY_SECOND = 0;

const DELAY_TIME = DateTime.now().plus({ seconds: DELAY_SECOND }).setZone('Asia/Taipei');

const YEAR = Number(DELAY_TIME.year);
const MONTH = Number(DELAY_TIME.month);
const DATE = Number(DELAY_TIME.day);
const HOUR = Number(DELAY_TIME.hour);
const MINUTE = Number(DELAY_TIME.minute);
const SECOND = Number(DELAY_TIME.second);

async function setParameter() {
    // Send `FLUSHDB` command to all masters:
    const masters = Cache.nodes('master');
    await Promise.all(masters.map((node) => node.flushdb()));
    await Cache.set('stock', STOCK);
    await Cache.set('transaction', 0);
    await Cache.set('price', 100);
    await Cache.set('product_id', 1);
    await Cache.set('year', YEAR);
    await Cache.set('month', MONTH);
    await Cache.set('date', DATE);
    await Cache.set('hour', HOUR);
    await Cache.set('minute', MINUTE);
    await Cache.set('second', SECOND);
}

module.exports = setParameter;
