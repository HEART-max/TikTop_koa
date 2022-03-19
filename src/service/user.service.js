const connections = require('../app/database')
class UserService {
  async create(user) {
    const { name, email, password } = user
    console.log(name, email, password)
    try {
      const statement = `INSERT INTO user (name,email,password) VALUES (?,?,?);`
      const result = await connections.execute(statement, [name, email, password])
      return '创建用户成功！'
      // return result[0]
    } catch (err) {
      console.log(err)
    }
  }
  async update(user) {
    const { email, name, sex, birthday, introduction, userId } = user
    try {
      const statement = `UPDATE user SET name=?,sex=?,birthday=?,introduction=? WHERE id=?;`
      const result = await connections.execute(statement, [name, sex, birthday, introduction, userId])
      return '修改用户成功！'
    } catch (err) {
      console.log(err)
    }
  }

  async getUserByEmail(email) {
    try {
      const statement = `SELECT * FROM user WHERE email = ?;`
      const result = await connections.execute(statement, [email])
      return result[0]
    } catch (err) {
      console.log(err)
    }
  }

  async updateAvatarUrlByEmail(email, avatarUrl) {
    try {
      const statement = `UPDATE user SET avatar_url = ? WHERE email = ?;`
      const [result] = await connections.execute(statement, [avatarUrl, email])
      return result
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new UserService()
