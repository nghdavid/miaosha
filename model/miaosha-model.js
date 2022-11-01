const Cache = require('../config/redis');
const CACHE_PEOPLE_KEY = 'people';

/**
 * * This function add 'people' (+=1) in cache
 */
const addPeople = async () => {
    try {
        if (Cache.ready) {
            const people = await Cache.incr(CACHE_PEOPLE_KEY);
            return people;
        } else {
            throw new Error('Redis Disconnect');
        }
    } catch (err) {
        console.error('Error happen in addPeople model');
        console.error(err);
        return { error: 'Redis Error: addPeople model' };
    }
};

module.exports = {
    addPeople,
};
