function wrapAsync(fn, filename) {
    return function (req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch((err) => {
            console.error('Error is in', filename);
            console.error('Error happen is from', fn.name, 'controller');
            next(err);
        });
    };
}
module.exports = {
    wrapAsync,
};
