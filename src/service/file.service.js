const connections = require('../app/database')
class FileService {
  async createAvatar(filename, mimetype, size, id, email) {
    const statement = `INSERT INTO avatar (filename, mimetype, size, user_id,email) VALUES (?,?,?,?,?)`
    const [result] = await connections.execute(statement, [filename, mimetype, size, id, email])
    return result
  }

  async getAvatarByUserId(userId) {
    const statement = `SELECT * FROM avatar WHERE user_id = ?;`
    const [result] = await connections.execute(statement, [userId])
    return result[result.length - 1]
  }

  async createFile(filename, mimetype, size, id, momentId) {
    const statement = `INSERT INTO file (filename, mimetype, size, user_id,moment_id) VALUES (?,?,?,?,?)`
    const [result] = await connections.execute(statement, [filename, mimetype, size, id, momentId])
    return result
  }
}

module.exports = new FileService()
