const express = require('express');
const productRouter = express.Router();
const { wrapAsync } = require('../util/utils');
const { auth } = require('../middleware/auth-middleware');
const productController = require('../controller/product-controller');
const FILE_NAME = __filename.slice(__dirname.length + 1, -3);

// GET
productRouter.get('/product/prize', wrapAsync(auth), wrapAsync(productController.prize, FILE_NAME));
module.exports = productRouter;
