const Cache = require('../config/redis-cluster').pubClient;
const { STOCK } = process.env;
const { DateTime } = require('luxon');
const DELAY_SECOND = Number(process.argv[2]);
if (isNaN(DELAY_SECOND)) {
    console.warn('Please add delay second');
    process.exit(0);
}
const DELAY_TIME = DateTime.now().plus({ seconds: DELAY_SECOND }).setZone('Asia/Taipei');

const YEAR = Number(DELAY_TIME.year);
const MONTH = Number(DELAY_TIME.month);
const DATE = Number(DELAY_TIME.day);
const HOUR = Number(DELAY_TIME.hour);
const MINUTE = Number(DELAY_TIME.minute);
const SECOND = Number(DELAY_TIME.second);
console.info(`Delay Time is ${YEAR}-${MONTH}-${DATE} ${HOUR}:${MINUTE}:${SECOND}`);

Cache.on('ready', async () => {
    // Send `FLUSHDB` command to all masters:
    const masters = Cache.nodes('master');
    await Promise.all(masters.map((node) => node.flushdb()));
    console.warn('Cleaning Redis!!!');
    console.info('Setting stock!!!');
    await Cache.set('stock', STOCK);
    console.info('Setting transaction!!!');
    await Cache.set('transaction', 0);
    console.info('Setting price!!!');
    await Cache.set('price', 100);
    console.info('Setting product id!!!');
    await Cache.set('product_id', 1);
    console.info('Setting starting time!!!');
    await Cache.set('year', YEAR);
    await Cache.set('month', MONTH);
    await Cache.set('date', DATE);
    await Cache.set('hour', HOUR);
    await Cache.set('minute', MINUTE);
    await Cache.set('second', SECOND);
    await Cache.disconnect();
    process.exit(0);
});
