const db = require('../config/db');

/**
 *
 * @param {*} a - a
 *
 * * This function
 *
 */
const template = async (data) => {
    try {
    } catch (err) {
        console.error('Error happen in  model');
        console.error(err);
        return { error: 'DB Error:  model' };
    }
};

module.exports = {
    template,
};
