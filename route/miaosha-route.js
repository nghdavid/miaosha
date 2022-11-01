const express = require('express');
const miaoshaRouter = express.Router();
const { wrapAsync } = require('../util/utils');
// const { authMiddleware } = require('../util/auth');
const { validateMiaosha } = require('../middleware/validate-miaosha-middleware');
const miaoshaController = require('../controller/miaosha-controller');
const FILE_NAME = __filename.slice(__dirname.length + 1, -3);

// GET
// miaoshaRouter.get('/', (req, res) => {
//   res.redirect('/homepage.html');
// });
// miaoshaRouter.get(
//   '/profile',
//   authMiddleware,
//   wrapAsync(miaoshaController.template, FILE_NAME)
// );

// POST
miaoshaRouter.post('/miaosha', wrapAsync(validateMiaosha), wrapAsync(miaoshaController.miaosha, FILE_NAME));
module.exports = miaoshaRouter;
