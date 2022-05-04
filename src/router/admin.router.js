const Router = require('koa-router')
const { videoList, videoState, commentList, deleteComment, login } = require('../controller/admin.controller')
const { verifyLogin, verifyAuth } = require('../middleware/auth.middleware')
const adminRouter = new Router({ prefix: '/admin' })

adminRouter.post('/video/:radio', videoList)
adminRouter.post('/videostate', videoState)
adminRouter.post('/comment', commentList)
adminRouter.delete('/comment', deleteComment)
adminRouter.post('/login', login)

module.exports = adminRouter
