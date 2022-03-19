const Router = require('koa-router')
const { create, update, avatarInfo } = require('../controller/user.controller')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')
const { verifyAuth } = require('../middleware/auth.middleware')
const userRouter = new Router({ prefix: '/user' })

userRouter.post('/', verifyUser, handlePassword, create)
userRouter.patch('/', verifyAuth, update)
userRouter.get('/:userId/avatar', avatarInfo)

module.exports = userRouter
