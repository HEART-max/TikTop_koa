const errorTypes = require('../constants/error-types')
const userService = require('../service/user.service')
const md5Password = require('../utils/password-handle')
const verifyUser = async (ctx, next) => {
  const { name, email, password } = ctx.request.body
  console.log(name, email, password)
  // 判断用户名或者密码是否为空
  if (!name || !email || !password) {
    const error = new Error(errorTypes.NAME_OR_EMAIL_OR_PASSWORD_IS_REQUIRED)
    return ctx.app.emit('error', error, ctx)
  }
  // 判断邮箱是否存在
  const result = await userService.getUserByEmail(email)
  if (result.length) {
    const error = new Error(errorTypes.USER_ALREADY_EXISTS)
    return ctx.app.emit('error', error, ctx)
  }
  await next()
}

const handlePassword = async (ctx, next) => {
  const { password } = ctx.request.body
  ctx.request.body.password = md5Password(password)
  await next()
}

module.exports = {
  verifyUser,
  handlePassword,
}
