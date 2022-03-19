const {
  create,
  reply,
  update,
  remove,
  getCommentByMomentId,
} = require('../service/comment.service')
class CommentController {
  async create(ctx, next) {
    const { momentId, content } = ctx.request.body
    const { id } = ctx.user
    const result = await create(momentId, content, id)
    // ctx.body = result
    ctx.body = '创建评论成功'
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
    const { momentId } = ctx.query
    const result = await getCommentByMomentId(momentId)
    ctx.body = result
    // ctx.body = '获取评论成功'
  }
}

module.exports = new CommentController()
