const fs = require('fs')
const nodemailer = require('nodemailer')
const md5Password = require('../utils/password-handle')
const { AVATAR_PATH } = require('../constants/file-path')
const { create, getUserInfoById, update, getUserByEmail, createVideoLike, videoUnlike, getVideoLikeByUserId, createUserFollow, userUnfollow, updatePassword, chat, getChatList, getMutualFollow, getMyFollow, getMyFollowBySearch } = require('../service/user.service')
const { getAvatarByFilename } = require('../service/file.service')
const { getVideoByUserId } = require('../service/video.service')
class UserController {
  async create(ctx, next) {
    // 获取请求数据
    const user = ctx.request.body
    // 查询数据库
    const result = await create(user)
    // 返回数据
    ctx.body = result
  }
  async userInfo(ctx, next) {
    // 获取请求数据
    const { userId } = ctx.params
    // 查询数据库
    const result = await getUserInfoById(userId)
    // 返回数据
    ctx.body = result
  }

  async update(ctx, next) {
    const user = ctx.request.body
    const result = await update(user)
    const userInfo = await getUserByEmail(ctx.user.email)
    ctx.body = userInfo[0]
  }
  // 修改密码
  async updatePassword(ctx, next) {
    const { email, oldPass, newPass } = ctx.request.body
    // 判断邮箱是否存在
    const result = await getUserByEmail(email)
    const user = result[0]
    if (!user) {
      const error = new Error(errorTypes.USER_DOES_NOT_EXISTS)
      return ctx.app.emit('error', error, ctx)
    }
    // 验证密码
    if (md5Password(oldPass) !== user.password) {
      ctx.body = { message: '旧密码错误' }
    } else {
      const result = await updatePassword(email, md5Password(newPass))
      ctx.body = result
    }
  }

  async avatarInfo(ctx, next) {
    const { filename } = ctx.params
    const result = await getAvatarByFilename(filename)
    ctx.response.set('content-type', result.mimetype)
    ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`)
  }
  async videoInfo(ctx, next) {
    const { userId } = ctx.params
    const result = await getVideoByUserId(userId)
    ctx.body = result
    // ctx.response.set('content-type', result.mimetype)
    // ctx.body = fs.createReadStream(`${AVATAR_PATH}/${result.filename}`)
  }

  async videoLike(ctx, next) {
    const { userId, videoId } = ctx.request.body
    const result = await createVideoLike(userId, videoId)
    ctx.body = result
  }
  async videoUnlike(ctx, next) {
    const { userId, videoId } = ctx.request.body
    const result = await videoUnlike(userId, videoId)
    ctx.body = result
  }
  async videoLikeList(ctx, next) {
    const { userId } = ctx.params
    const result = await getVideoLikeByUserId(userId)
    ctx.body = {
      videoLikeList: result,
      message: '获取喜欢列表成功',
    }
  }
  async userFollow(ctx, next) {
    const { userId, user2Id } = ctx.request.body
    const result = await createUserFollow(userId, user2Id)
    ctx.body = result
  }
  async userUnfollow(ctx, next) {
    const { userId, user2Id } = ctx.request.body
    const result = await userUnfollow(userId, user2Id)
    ctx.body = result
  }
  async emailCode(ctx, next) {
    const { email } = ctx.params
    const emailCode = Math.random().toFixed(6).slice(-6)
    //创建一个SMTP客户端配置
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com', // 这是腾讯的邮箱 host
      port: 465, // smtp 端口
      secureConnection: true,
      auth: {
        user: '1185289878@qq.com', // 发送邮件的邮箱名
        pass: 'eyretnvdmsdwibid', // 邮箱的授权码，也可以使用邮箱登陆密码
      },
    })
    transporter.sendMail(
      {
        from: '1185289878@qq.com', // 发送人邮箱
        to: email, // 接收人邮箱，多个使用数组或用逗号隔开
        subject: 'TikTop验证码', // 主题
        html: emailCode, // 邮件正文 可以为 HTML 或者 text
      },
      (err) => {
        if (err) {
          throw err
        }
      }
    )
    ctx.body = {
      emailCode,
      message: '发送验证码成功',
    }
  }
  async createChat(ctx, next) {
    const { userId, user2Id, message } = ctx.request.body
    console.log(userId, user2Id, message)
    const result = await chat(userId, user2Id, message)
    ctx.body = result
  }
  async chatList(ctx, next) {
    const { userId, user2Id } = ctx.request.body
    const result = await getChatList(userId, user2Id)
    ctx.body = result
  }
  async mutualFollow(ctx, next) {
    const { userId } = ctx.params
    const result = await getMutualFollow(userId)
    ctx.body = result
  }
  async myFollow(ctx, next) {
    const { userId } = ctx.params
    const result = await getMyFollow(userId)
    ctx.body = result
  }
  async search(ctx, next) {
    const { userId, searchValue } = ctx.request.body
    const result = await getMyFollowBySearch(userId, searchValue)
    ctx.body = result
  }
}

module.exports = new UserController()
