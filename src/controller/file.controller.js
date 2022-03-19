const { createAvatar, createFile } = require('../service/file.service')
const { updateAvatarUrlByEmail } = require('../service/user.service')
const { APP_HOST, APP_PORT } = require('../app/config')
class FileController {
  async saveAvatarInfo(ctx, next) {
    const { filename, mimetype, size } = ctx.req.file
    const { id, email } = ctx.user
    const result = await createAvatar(filename, mimetype, size, id, email)
    const avatarUrl = `${APP_HOST}:${APP_PORT}/user/${id}/avatar`
    await updateAvatarUrlByEmail(email, avatarUrl)
    ctx.body = '上传头像成功'
  }

  async savePrictureInfo(ctx, next) {
    const files = ctx.req.files
    const { id } = ctx.user
    const { momentId } = ctx.query
    for (let file of files) {
      const { filename, mimetype, size } = file
      await createFile(filename, mimetype, size, id, momentId)
    }

    ctx.body = '动态配图上传成功'
  }
}

module.exports = new FileController()
