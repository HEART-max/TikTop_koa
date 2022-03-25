const Router = require('koa-router')
const { verifyAuth, verifyAuthPermission } = require('../middleware/auth.middleware')
const { create, reply, update, remove, list, commentLike, commentUnlike } = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

commentRouter.post('/', verifyAuth, create)
commentRouter.get('/:videoId', list)
commentRouter.post('/like', verifyAuth, commentLike) // 点赞评论
commentRouter.delete('/unlike', verifyAuth, commentUnlike) // 取消点赞

commentRouter.post('/:commentId/reply', verifyAuth, reply)
commentRouter.patch('/:commentId', verifyAuth, verifyAuthPermission, update)
commentRouter.delete('/:commentId', verifyAuth, verifyAuthPermission, remove)

module.exports = commentRouter
