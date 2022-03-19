const { create, getLabels } = require('../service/label.service')
class LabelController {
  async create(ctx, next) {
    const { labelName } = ctx.request.body
    const result = await create(labelName)
    // ctx.body = result
    ctx.body = '创建标签成功'
  }

  async list(ctx, next) {
    const { limit, offset } = ctx.query
    const result = await getLabels(limit, offset)
    ctx.body = result
  }
}

module.exports = new LabelController()
