const Router = require('koa-router')
const { create, userInfo, update, updatePassword, avatarInfo, videoInfo, videoLike, videoUnlike, videoLikeList, userFollow, userUnfollow, emailCode, createChat, chatList, mutualFollow, myFollow, search } = require('../controller/user.controller')
const { verifyUser, handlePassword } = require('../middleware/user.middleware')
const { verifyAuth } = require('../middleware/auth.middleware')
const userRouter = new Router({ prefix: '/user' })

userRouter.post('/', verifyUser, handlePassword, create) // 注册
userRouter.get('/email/:email', emailCode)
userRouter.get('/:userId', verifyAuth, userInfo) // 获取用户信息
userRouter.patch('/', verifyAuth, update) // 修改用户信息
userRouter.patch('/password', verifyAuth, updatePassword) // 修改用户信息
userRouter.get('/avatar/:filename', avatarInfo) // 获取头像
userRouter.get('/video/:userId', verifyAuth, videoInfo) // 获取视频
userRouter.post('/like', verifyAuth, videoLike) // 点赞视频
userRouter.delete('/unlike', verifyAuth, videoUnlike) // 取消点赞
userRouter.get('/like/:userId', verifyAuth, videoLikeList) // 获取点赞视频
userRouter.post('/follow', verifyAuth, userFollow) // 关注用户
userRouter.delete('/unfollow', verifyAuth, userUnfollow) // 取消点赞
userRouter.post('/chat', verifyAuth, createChat) // 发送消息
userRouter.post('/chatdata', verifyAuth, chatList) // 获取消息,写上面才生效或者设置为post才可以，不知道为什么
userRouter.post('/follow/:userId', verifyAuth, mutualFollow) // 获取互相关注的人
userRouter.post('/myfollow/:userId', verifyAuth, myFollow) // 获取互相关注的人
userRouter.post('/search', verifyAuth, search) // 搜索互相关注的人

module.exports = userRouter
