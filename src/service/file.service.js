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
  async getAvatarByFilename(filename) {
    const statement = `SELECT * FROM avatar WHERE filename = ?;`
    const [result] = await connections.execute(statement, [filename])
    return result[result.length - 1]
  }

  async createFile(filename, mimetype, size, id, momentId) {
    const statement = `INSERT INTO file (filename, mimetype, size, user_id,moment_id) VALUES (?,?,?,?,?)`
    const [result] = await connections.execute(statement, [filename, mimetype, size, id, momentId])
    return result
  }

  async createVideo(videoUrl, filename, mimetype, size, previewUrl, id, desc) {
    console.log(videoUrl, filename, mimetype, size, previewUrl, id, desc)
    try {
      const statement = `INSERT INTO video (file_url, filename, mimetype, size, preview_url, user_id,video_desc,video_like,comment) VALUES (?,?,?,?,?,?,?,?,?)`
      const [result] = await connections.execute(statement, [videoUrl, filename, mimetype, size, previewUrl, id, desc, 0, 0])
      return result
    } catch (err) {
      console.log(err)
      return result
    }
  }
}

module.exports = new FileService()
