const { getVideoList } = require('../service/video.service')
class VideoController {
  async videoList(ctx, next) {
    const { page, rows } = ctx.query
    const offset = (page * rows).toString()
    const size = rows
    const result = await getVideoList(offset, size)
    ctx.body = result
  }
}

module.exports = new VideoController()
