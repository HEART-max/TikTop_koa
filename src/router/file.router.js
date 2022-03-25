const Router = require('koa-router')
const { verifyAuth } = require('../middleware/auth.middleware')
const { avatarHandler, videoHandler, VideoSecondaryHandler } = require('../middleware/file.middleware')
const { saveAvatarInfo, savePrictureInfo, saveVideoInfo } = require('../controller/file.controller')

const fileRouter = new Router({ prefix: '/upload' })

fileRouter.post('/avatar', verifyAuth, avatarHandler, saveAvatarInfo)
// fileRouter.post('/picture', verifyAuth, pictureHandler, savePrictureInfo)
fileRouter.post('/video', verifyAuth, videoHandler, VideoSecondaryHandler, saveVideoInfo)

module.exports = fileRouter
