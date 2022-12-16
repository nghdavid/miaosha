const express = require('express');
const miaoshaRouter = express.Router();
const { wrapAsync } = require('../util/utils');
const { validateMiaosha } = require('../middleware/validate-miaosha-middleware');
const miaoshaController = require('../controller/miaosha-controller');
const FILE_NAME = __filename.slice(__dirname.length + 1, -3);

// POST
miaoshaRouter.post('/miaosha', wrapAsync(validateMiaosha), wrapAsync(miaoshaController.miaosha, FILE_NAME));
module.exports = miaoshaRouter;
