const Cache = require('../config/redis-cluster').pubClient;
const { STOCK, YEAR, MONTH, DATE, HOUR, MINUTE } = process.env;

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
    // console.info('Setting consumer!!!');
    // await Cache.set('num_consumer', NUM_CONSUMER);
    // await Cache.sadd('consumers', [...Array(NUM_CONSUMER).keys()]);
    // await Cache.sadd('pay_consumers', [...Array(NUM_CONSUMER).keys()]);
    console.info('Setting starting time!!!');
    await Cache.set('year', YEAR);
    await Cache.set('month', MONTH);
    await Cache.set('date', DATE);
    await Cache.set('hour', HOUR);
    await Cache.set('minute', MINUTE);
    process.exit(0);
});
