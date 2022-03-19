const Router = require('koa-router')
const momentRouter = new Router({ prefix: '/moment' })
const { verifyAuth, verifyAuthPermission } = require('../middleware/auth.middleware')
const { verifyLabelExists } = require('../middleware/label.middleware')
const { create, list, detail, update, remove, addLabels } = require('../controller/moment.controller')

momentRouter.post('/', verifyAuth, create)
momentRouter.get('/', list)
momentRouter.get('/:momentId', detail)
momentRouter.patch('/:momentId', verifyAuth, verifyAuthPermission, update)
momentRouter.delete('/:momentId', verifyAuth, verifyAuthPermission, remove)
momentRouter.post('/:momentId/label', verifyAuth, verifyAuthPermission, verifyLabelExists, addLabels)

module.exports = momentRouter
