const { create, reply, update, remove, getCommentByVideoId, createCommentLike, commentUnlike } = require('../service/comment.service')
class CommentController {
  async create(ctx, next) {
    const { content, videoId, userId, commentId } = ctx.request.body
    console.log(content, videoId, userId, commentId)
    const result = await create(content, videoId, userId, commentId)
    ctx.body = {
      message: '创建评论成功',
    }
  }

  async reply(ctx, next) {
    const { momentId, content } = ctx.request.body
    const { commentId } = ctx.params
    const { id } = ctx.user
    const result = await reply(momentId, content, commentId, id)
    // ctx.body = result
    ctx.body = '回复评论成功'
  }

  async update(ctx, next) {
    const { commentId } = ctx.params
    const { content } = ctx.request.body
    const result = await update(commentId, content)
    // ctx.body = result
    ctx.body = '修改评论成功'
  }

  async remove(ctx, next) {
    const { commentId } = ctx.params
    const result = await remove(commentId)
    // ctx.body = result
    ctx.body = '删除评论成功'
  }

  async list(ctx, next) {
    const { videoId } = ctx.params
    const result = await getCommentByVideoId(videoId)
    ctx.body = {
      commentList: result,
      message: '获取评论成功',
    }
  }
  async commentLike(ctx, next) {
    const { userId, commentId } = ctx.request.body
    const result = await createCommentLike(userId, commentId)
    ctx.body = result
  }
  async commentUnlike(ctx, next) {
    const { userId, commentId } = ctx.request.body
    console.log(userId, commentId)
    const result = await commentUnlike(userId, commentId)
    ctx.body = result
  }
}

module.exports = new CommentController()
