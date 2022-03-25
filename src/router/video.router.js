const Router = require('koa-router')
const { videoList, followVideoList, detail, dowload, previewInfo, searchVideoList } = require('../controller/video.controller')
const { verifyAuth } = require('../middleware/auth.middleware')
const videoRouter = new Router({ prefix: '/video' })

videoRouter.get('/', videoList)
videoRouter.get('/follow/:userId', verifyAuth, followVideoList)
videoRouter.get('/:filename', detail)
videoRouter.get('/dowload/:filename', dowload)
videoRouter.get('/preview/:filename', previewInfo)
// 不能使用get方法，不知道为什么
videoRouter.post('/search', verifyAuth, searchVideoList)

module.exports = videoRouter
