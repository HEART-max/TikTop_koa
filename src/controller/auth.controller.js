// const { login } = require('../service/user.service')
const jwt = require('jsonwebtoken')
const { PRIVATE_KEY } = require('../app/config')
class AuthController {
  async login(ctx, next) {
    // 获取请求数据
    const { id, email } = ctx.user
    const token = jwt.sign({ id, email }, PRIVATE_KEY, {
      expiresIn: 60 * 60 * 24,
      algorithm: 'RS256',
    })
    // 返回数据
    ctx.body = {
      user: ctx.user,
      token,
    }
  }
  async success(ctx, next) {
    ctx.body = '授权成功'
  }
}

module.exports = new AuthController()
