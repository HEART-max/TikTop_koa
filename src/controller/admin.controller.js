const { getVideoList, updateVideoStateById, getCommentList, deleteCommentById, login } = require('../service/admin.service')
class AdminController {
  async videoList(ctx, next) {
    const { radio } = ctx.params
    const result = await getVideoList(radio)
    ctx.body = {
      videoList: result,
      message: '获取所有视频成功',
    }
  }
  async videoState(ctx, next) {
    const { videoId, state } = ctx.request.body
    const result = await updateVideoStateById(videoId, state)
    ctx.body = {
      message: '修改成功',
    }
  }
  async commentList(ctx, next) {
    const result = await getCommentList()
    ctx.body = {
      commentList: result,
      message: '获取所有评论成功',
    }
  }
  async deleteComment(ctx, next) {
    const { commentId, videoId } = ctx.request.body
    const result = await deleteCommentById(commentId, videoId)
    ctx.body = {
      message: '删除评论成功',
    }
  }
  async login(ctx, next) {
    const { account, password } = ctx.request.body
    const result = await login(account, password)
    ctx.body = result
  }
}

module.exports = new AdminController()
