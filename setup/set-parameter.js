const Cache = require('../config/redis-cluster').pubClient;
const { STOCK } = process.env;

const YEAR = Number(process.argv[2]);
const MONTH = Number(process.argv[3]);
const DATE = Number(process.argv[4]);
const HOUR = Number(process.argv[5]);
const MINUTE = Number(process.argv[6]);
let SECOND = Number(process.argv[7]);
if (isNaN(SECOND)) {
    SECOND = 0;
}
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
    process.exit(0);
});
