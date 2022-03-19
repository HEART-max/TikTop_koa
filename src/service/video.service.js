const connections = require('../app/database')
class VideoService {
  async getVideoList(offset, size) {
    try {
      // const statement = `SELECT * FROM video LIMIT ?,?;`
      const statement = `
      SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
      FROM video v
      LEFT JOIN user u ON v.user_id = u.id
      LIMIT ?,?;`
      const [result] = await connections.execute(statement, [offset, size])
      return result
    } catch (err) {
      console.log(err)
    }
  }
}
module.exports = new VideoService()
