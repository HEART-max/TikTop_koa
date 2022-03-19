const connection = require('../app/database')
const connections = require('../app/database')

class MomentService {
  async create(userId, content) {
    try {
      const statement = `INSERT INTO moment (content,user_id) VALUES(?,?);`
      const [result] = await connection.execute(statement, [content, userId])
      return '创建文章成功'
    } catch (err) {
      console.log(err)
    }
  }

  async getMomentById(momentId) {
    try {
      const statement = `
        SELECT 
          m.id id, m.content content, m.createAt createTime,m.updateAt updateTime,
          JSON_OBJECT('id',u.id,'name',u.name) user
        FROM moment m
        LEFT JOIN user u ON m.user_id = u.id
        WHERE m.id = ?;
    `
      const [result] = await connection.execute(statement, [momentId])
      return result[0]
    } catch (err) {
      console.log(err)
    }
  }

  async getMomentList(offset, size) {
    try {
      const statement = `
        SELECT 
          m.id id, m.content content, m.createAt createTime,m.updateAt updateTime,
          JSON_OBJECT('id',u.id,'name',u.name) user,
          (SELECT COUNT(*) FROM comment c WHERE c.moment_id = m.id) commentCount
        FROM moment m
        LEFT JOIN user u ON m.user_id = u.id
        LIMIT ?,?
      `
      const [result] = await connection.execute(statement, [offset, size])
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async updateMomentById(momentId, content) {
    try {
      const statement = `UPDATE moment SET content = ? WHERE id = ?;`
      const [result] = await connection.execute(statement, [content, momentId])
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async removeMomentById(momentId) {
    try {
      const statement = `DELETE FROM moment WHERE id = ?`
      const [result] = await connection.execute(statement, [momentId])
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async hasLabel(momentId, labelId) {
    try {
      const statement = `SELECT * FROM moment_label WHERE moment_id = ? AND label_id = ?;`
      const [result] = await connection.execute(statement, [momentId, labelId])
      return result[0] ? true : false
    } catch (err) {
      console.log(err)
    }
  }

  async addLabel(momentId, labelId) {
    try {
      const statement = `INSERT INTO moment_label (moment_id , label_id) VALUES (?,?)`
      const result = await connection.execute(statement, [momentId, labelId])
      return result
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new MomentService()
