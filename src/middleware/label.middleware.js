const { create, getLabelByName } = require('../service/label.service')
const connections = require('../app/database')
const verifyLabelExists = async (ctx, next) => {
  const { labels } = ctx.request.body
  const newLabels = []
  for (let name of labels) {
    const labelResult = await getLabelByName(name)
    const label = { name }
    if (!labelResult) {
      const result = await create(name)
      label.id = result.insertId
    } else {
      label.id = labelResult.id
    }
    newLabels.push(label)
  }
  ctx.labels = newLabels
  await next()
}

module.exports = {
  verifyLabelExists,
}
