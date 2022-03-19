const Router = require('koa-router')
const {
  verifyAuth,
  verifyAuthPermission,
} = require('../middleware/auth.middleware')
const {
  create,
  reply,
  update,
  remove,
  list,
} = require('../controller/comment.controller')

const commentRouter = new Router({ prefix: '/comment' })

commentRouter.post('/', verifyAuth, create)
commentRouter.post('/:commentId/reply', verifyAuth, reply)
commentRouter.patch('/:commentId', verifyAuth, verifyAuthPermission, update)
commentRouter.delete('/:commentId', verifyAuth, verifyAuthPermission, remove)
commentRouter.get('/', list)

module.exports = commentRouter
