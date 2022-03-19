const Router = require('koa-router')
const { videoList } = require('../controller/video.controller')
const { verifyAuth } = require('../middleware/auth.middleware')
const videoRouter = new Router({ prefix: '/video' })

videoRouter.get('/', videoList)

module.exports = videoRouter
