const errorTypes = require('../constants/error-types')

const errorHandler = (error, ctx) => {
  let status, data

  switch (error.message) {
    case errorTypes.NAME_OR_EMAIL_OR_PASSWORD_IS_REQUIRED:
      status = 400
      data = {
        message: '用户名或者邮箱或者密码为空',
      }
      break
    case errorTypes.EMAIL_OR_PASSWORD_IS_REQUIRED:
      status = 400
      data = {
        message: '邮箱或者密码为空',
      }
      break
    case errorTypes.USER_ALREADY_EXISTS:
      status = 409
      data = {
        message: '邮箱已存在',
        des: '该邮箱已被注册，请重新更换邮箱',
      }
      break
    case errorTypes.USER_DOES_NOT_EXISTS:
      status = 400
      data = {
        message: '邮箱不存在',
      }
      break
    case errorTypes.PASSWORD_IS_INCORRENT:
      status = 400
      data = {
        message: '密码错误',
      }
      break
    case errorTypes.UNAUTHORIZATION:
      status = 401
      data = {
        message: '无效token',
      }
      break
    case errorTypes.UNPERMISSION:
      status = 401
      data = {
        message: '您不具备操作权限',
      }
      break

    default:
      status = 404
      data = {
        message: 'NOT FOUND',
      }
      break
  }
  ctx.status = status
  ctx.body = data
}

module.exports = errorHandler
