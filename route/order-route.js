const express = require('express');
const orderRouter = express.Router();
const { wrapAsync } = require('../util/utils');
const { authCheckout } = require('../middleware/auth-checkout-middleware');
const orderController = require('../controller/order-controller');
const FILE_NAME = __filename.slice(__dirname.length + 1, -3);

// POST
orderRouter.post('/order/checkout', wrapAsync(authCheckout), wrapAsync(orderController.checkout, FILE_NAME));
module.exports = orderRouter;
