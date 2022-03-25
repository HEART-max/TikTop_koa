const fs = require('fs')
const { VIDEO_PATH, PREVIEW_PATH } = require('../constants/file-path')
const { getVideoList, getFollowVideoById, getVideoByFilename, getPreviewInfoByFilename, getVideoListBySearchValue } = require('../service/video.service')
class VideoController {
  async videoList(ctx, next) {
    const { userId, page, rows } = ctx.query
    const offset = (page * rows).toString()
    const size = rows
    const result = await getVideoList(userId, offset, size)
    ctx.body = result
  }
  async followVideoList(ctx, next) {
    const { userId } = ctx.params
    const result = await getFollowVideoById(userId)
    ctx.body = result
  }
  async detail(ctx, next) {
    const { filename } = ctx.params
    const result = await getVideoByFilename(filename)
    ctx.response.set('content-type', result.mimetype)
    ctx.body = fs.createReadStream(`${VIDEO_PATH}/${result.filename}`)
  }
  async dowload(ctx, next) {
    const { filename } = ctx.params
    ctx.body = fs.createReadStream(`${VIDEO_PATH}/${filename}`)
  }
  async previewInfo(ctx, next) {
    const { filename } = ctx.params
    const mimetype = `image/${filename.split('.')[1]}`
    ctx.response.set('content-type', mimetype)
    ctx.body = fs.createReadStream(`${PREVIEW_PATH}/${filename}`)
  }
  async searchVideoList(ctx, next) {
    const { userId, searchValue } = ctx.query
    const result = await getVideoListBySearchValue(userId, searchValue)
    ctx.body = result
  }
}

module.exports = new VideoController()
