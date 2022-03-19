const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const useRouter = require('../router/index')
const errorHandler = require('./error-handler')

const app = new Koa()

app.use(bodyParser())
useRouter(app)

app.on('error', errorHandler)

module.exports = app
