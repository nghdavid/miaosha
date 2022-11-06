const express = require('express');
const userRouter = express.Router();
const { wrapAsync } = require('../util/utils');
const userController = require('../controller/user-controller');
const FILE_NAME = __filename.slice(__dirname.length + 1, -3);

userRouter.post('/user/signin', wrapAsync(userController.signIn, FILE_NAME));
userRouter.post('/user/signup', wrapAsync(userController.signUp, FILE_NAME));
module.exports = userRouter;
