const connections = require('../app/database')
class LabelService {
  async create(labelName) {
    try {
      const statement = `INSERT INTO label (name) VALUES(?)`
      const [result] = await connections.execute(statement, [labelName])
    } catch (err) {
      console.log(err)
    }
  }
  async getLabelByName(name) {
    try {
      const statement = `SELECT * FROM label WHERE name = ?`
      const [result] = await connections.execute(statement, [name])
      return result[0]
    } catch (err) {
      console.log(err)
    }
  }

  async getLabels(limit, offset) {
    try {
      const statement = `SELECT * FROM label LIMIT ? , ?;`
      const [result] = await connections.execute(statement, [offset, limit])
      return result
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new LabelService()
