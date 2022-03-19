const jwt = require('jsonwebtoken')
const errorTypes = require('../constants/error-types')
const userService = require('../service/user.service')
const authService = require('../service/auth.service')
const md5Password = require('../utils/password-handle')
const { PUBLIC_KEY } = require('../app/config')

const verifyLogin = async (ctx, next) => {
  const { email, password } = ctx.request.body

  // 判断用户名或者密码是否为空
  if (!email || !password) {
    const error = new Error(errorTypes.EMAIL_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }
  // 判断邮箱是否存在
  const result = await userService.getUserByEmail(email)
  const user = result[0]
  if (!user) {
    const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }
  // 验证密码
  if (md5Password(password) !== user.password) {
    const error = new Error(errorTypes.PASSWORD_IS_INCORRENT)
    return ctx.app.emit('error', error, ctx)
  }
  ctx.user = user
  await next()
}
const verifyAuth = async (ctx, next) => {
  const authorization = ctx.headers.authorization
  if (!authorization) {
    const error = new Error(errorTypes.UNAUTHORIZATION)
    return ctx.app.emit('error', error, ctx)
  }
  const token = authorization.replace('Bearer ', '')
  try {
    const result = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    })
    ctx.user = result
    await next()
  } catch (err) {
    const error = new Error(errorTypes.UNAUTHORIZATION)
    ctx.app.emit('error', error, ctx)
  }
}
const verifyAuthPermission = async (ctx, next) => {
  const [resourceKey] = Object.keys(ctx.params)
  const tableName = resourceKey.replace('Id', '')
  const resourceId = ctx.params[resourceKey]
  const { id } = ctx.user
  try {
    const isPermission = await authService.checkResource(tableName, resourceId, id)
    if (!isPermission) throw new Error()
    await next()
  } catch (err) {
    const error = new Error(errorTypes.UNPERMISSION)
    return ctx.app.emit('error', error, ctx)
  }
}
module.exports = {
  verifyLogin,
  verifyAuth,
  verifyAuthPermission,
}
