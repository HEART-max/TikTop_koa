const Router = require('koa-router')
const { verifyAuth } = require('../middleware/auth.middleware')
const { create, list } = require('../controller/label.controller')
const LabelRouter = new Router({ prefix: '/label' })
LabelRouter.post('/', verifyAuth, create)
LabelRouter.get('/', verifyAuth, list)

module.exports = LabelRouter
