const connections = require('../app/database')
class UserService {
  async create(user) {
    const { name, email, password } = user
    console.log(name, email, password)
    try {
      const defaultAvatar = `http://localhost:8888/user/avatar/default_avatar.png`
      const statement = `INSERT INTO user (name,email,password,avatar_url) VALUES (?,?,?,?);`
      const result = await connections.execute(statement, [name, email, password, defaultAvatar])
      return '创建用户成功！'
    } catch (err) {
      console.log(err)
    }
  }
  async getUserInfoById(userId) {
    try {
      const statement = `SELECT * FROM user WHERE id = ?;`
      const [result] = await connections.execute(statement, [userId])
      return result[0]
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
  async updatePassword(email, newPass) {
    try {
      const statement = `UPDATE user SET password=? WHERE email=?;`
      const result = await connections.execute(statement, [newPass, email])
      return { message: '修改成功', state: 200 }
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

  async createVideoLike(userId, videoId) {
    try {
      console.log(userId, videoId)
      const statement = `INSERT INTO video_like (user_id,video_id) VALUES (?,?);`
      const statement2 = `UPDATE video SET video_like = video_like+1 WHERE id = ?;`
      const result = await connections.execute(statement, [userId, videoId])
      const result2 = await connections.execute(statement2, [videoId])
      return { message: '点赞成功' }
    } catch (err) {
      console.log(err)
    }
  }
  async videoUnlike(userId, videoId) {
    try {
      const statement = `DELETE FROM video_like WHERE user_id = ? AND video_id = ?;`
      const statement2 = `UPDATE video SET video_like = video_like-1 WHERE id = ?;`
      const result = await connections.execute(statement, [userId, videoId])
      const result2 = await connections.execute(statement2, [videoId])
      return { message: '取消点赞成功' }
    } catch (err) {
      console.log(err)
    }
  }
  // 获取喜欢的视频
  async getVideoLikeByUserId(userId) {
    try {
      const statement = `
      SELECT t.* from 
      (SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
      FROM video v
      LEFT JOIN user u ON v.user_id = u.id) t 
      LEFT JOIN  video_like vl ON t.id =vl.video_id
      WHERE vl.user_id = ?;`
      const [result] = await connections.execute(statement, [userId])
      for (let key in result) {
        result[key].isLike = 1
        const statement2 = `SELECT * FROM attention WHERE user_id = ? AND user2_id = ?`
        const [result2] = await connections.execute(statement2, [userId, result[key].user_id])
        if (result2.length !== 0) {
          result[key].isFollow = true
        } else {
          result[key].isFollow = false
        }
      }
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async createUserFollow(userId, user2Id) {
    const statement = `INSERT INTO attention (user_id,user2_id) VALUES(?,?);`
    const [result] = await connections.execute(statement, [userId, user2Id])
    return {
      message: '关注成功',
    }
  }
  async userUnfollow(userId, user2Id) {
    const statement = `DELETE FROM attention WHERE user_id = ? AND user2_id = ?;`
    const [result] = await connections.execute(statement, [userId, user2Id])
    return {
      message: '取消关注成功',
    }
  }
  async chat(userId, user2Id, message) {
    try {
      const statement = `INSERT INTO chat (user_id,user2_id,message) VALUES(?,?,?);`
      const [result] = await connections.execute(statement, [userId, user2Id, message])
      return {
        message: '发送聊天成功',
      }
    } catch (err) {
      console.log(err)
    }
  }
  async getChatList(userId, user2Id) {
    try {
      const statement = `
      SELECT * 
      FROM chat
      WHERE (user_id = ? AND user2_id = ?) OR (user_id = ? AND user2_id = ?)`
      const [result] = await connections.execute(statement, [userId, user2Id, user2Id, userId])
      return {
        messageList: result,
        message: '获取聊天记录成功',
      }
    } catch (err) {
      console.log(err)
    }
  }
  async getMutualFollow(userId) {
    try {
      const userList = []
      const statement = `
      select * 
      from attention a 
      where a.user_id=? and exists(select ? from attention where a.user_id=user2_id and a.user2_id=user_id)`
      const [result] = await connections.execute(statement, [userId, userId])
      for (let key in result) {
        const statement2 = `SELECT * FROM user WHERE id = ?;`
        const [result2] = await connections.execute(statement2, [result[key].user2_id])
        userList.push(result2[0])
      }
      return userList
    } catch (err) {
      console.log(err)
    }
  }
  async getMyFollow(userId) {
    try {
      const userList = []
      const statement = `SELECT * FROM attention WHERE user_id = ?`
      const [result] = await connections.execute(statement, [userId])
      for (let key in result) {
        const statement2 = `SELECT * FROM user WHERE id = ?;`
        const [result2] = await connections.execute(statement2, [result[key].user2_id])
        userList.push(result2[0])
      }
      return userList
    } catch (err) {
      console.log(err)
    }
  }
  async getMyFollowBySearch(userId, searchValue) {
    try {
      const statement = `
      SELECT s.* FROM
      (SELECT u.* FROM
      (SELECT * 
      FROM attention 
      WHERE user_id = ?) t
      LEFT JOIN user u ON u.id = t.user2_id) s
      WHERE s.name LIKE ? OR s.introduction LIKE ?`
      const [result] = await connections.execute(statement, [userId, `%${searchValue}%`, `%${searchValue}%`])
      return result
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new UserService()
