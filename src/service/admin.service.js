const connection = require('../app/database')
class AdminService {
  async getVideoList(radio) {
    try {
      if (radio === 'all') {
        const statement = `
        SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
        FROM video v 
        LEFT JOIN user u ON v.user_id = u.id`
        const [result] = await connection.execute(statement, [])
        return result
      } else {
        const statement = `
        SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user FROM
        (SELECT *
        FROM video  
        WHERE state = ?) v
        LEFT JOIN user u ON v.user_id = u.id`
        const [result] = await connection.execute(statement, [radio])
        return result
      }
    } catch (err) {
      console.log(err)
    }
  }
  async updateVideoStateById(videoId, state) {
    try {
      const statement = `UPDATE video SET state = ? WHERE id =?`
      const [result] = await connection.execute(statement, [state, videoId])
      return result
    } catch (err) {
      console.log(err)
    }
  }
  async getCommentList() {
    try {
      const statement = `
      SELECT c.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
      FROM comment c 
      LEFT JOIN user u ON c.user_id = u.id`
      const [result] = await connection.execute(statement, [])
      return result
    } catch (err) {
      console.log(err)
    }
  }
  async deleteCommentById(commentId, videoId) {
    try {
      const statement = `SELECT COUNT(*) num FROM comment WHERE id = ? OR comment_id = ?`
      const [result] = await connection.execute(statement, [commentId, commentId])
      const statement2 = `DELETE FROM comment WHERE id = ? OR comment_id = ?;`
      const [result2] = await connection.execute(statement2, [commentId, commentId])
      const statement3 = `UPDATE video SET comment = comment-? WHERE id = ?;`
      const [result3] = await connection.execute(statement3, [result[0].num, videoId])
      return result
    } catch (err) {
      console.log(err)
    }
  }
  async login(account, password) {
    try {
      const statement = `SELECT * FROM admin WHERE account = ? AND password = ?`
      const [result] = await connection.execute(statement, [account, password])
      if (result.length === 0) {
        return {
          state: 400,
          message: '账号或者密码错误',
        }
      } else {
        return {
          state: 200,
          admin: result[0],
          message: '登陆成功',
        }
      }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new AdminService()
