const fs = require('fs')
const { AVATAR_PATH } = require('../constants/file-path')
const { create, update, getUserByEmail } = require('../service/user.service')
const { getAvatarByUserId } = require('../service/file.service')
class UserController {
  async create(ctx, next) {
    // 获取请求数据
    const user = ctx.request.body
    // 查询数据库
    const result = await create(user)
    // 返回数据
    ctx.body = result
  }

  async update(ctx, next) {
    const user = ctx.request.body
    const result = await update(user)
    const userInfo = await getUserByEmail(ctx.user.email)
    ctx.body = userInfo[0]
  }

  async avatarInfo(ctx, next) {
    const { userId } = ctx.params
    const result = await getAvatarByUserId(userId)
    ctx.response.set('content-type', result.mimetype)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`)
  }
}

module.exports = new UserController()
