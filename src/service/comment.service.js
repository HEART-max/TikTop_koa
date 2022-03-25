const connection = require('../app/database')

class CommentService {
  async create(content, videoId, userId, commentId) {
    try {
      const statement = `INSERT INTO comment (content,video_id,user_id,comment_id,comment_like,reply_num) VALUES (?,?,?,?,?,?);`
      const [result] = await connection.execute(statement, [content, videoId, userId, commentId ? commentId : null, 0, 0])
      // 更新视频评论次数
      const statement2 = `UPDATE video SET comment = comment+1 WHERE id = ?;`
      const [result2] = await connection.execute(statement2, [videoId])
      // 当为回复评论时
      if (commentId) {
        const statement3 = `UPDATE comment SET reply_num = reply_num+1 WHERE id = ?;`
        const [result3] = await connection.execute(statement2, [commentId])
      }
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async reply(momentId, content, commentId, userId) {
    try {
      const statement = `INSERT INTO comment (content,moment_id,comment_id,user_id) VALUES (?,?,?,?);`
      const [result] = await connection.execute(statement, [content, momentId, commentId, userId])
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async update(commentId, content) {
    try {
      const statement = `UPDATE comment SET content = ? WHERE id = ?;`
      const [result] = await connection.execute(statement, [content, commentId])
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async remove(commentId) {
    try {
      const statement = `DELETE FROM comment WHERE id = ?;`
      const [result] = await connection.execute(statement, [commentId])
      return result
    } catch (err) {
      console.log(err)
    }
  }

  async getCommentByVideoId(videoId) {
    try {
      // const statement = `
      // SELECT c.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
      // FROM comment c
      // LEFT JOIN user u ON c.user_id = u.id
      // WHERE video_id = ? AND comment_id IS NULL;`
      const statement = `
      SELECT if(cl.comment_id is null,false,true) as isLike, t.* from 
      (SELECT c.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
      FROM comment c
      LEFT JOIN user u ON c.user_id = u.id
      WHERE video_id = ? AND comment_id IS NULL) t
      LEFT JOIN  comment_like cl ON t.user_id =cl.user_id and t.id=cl.comment_id;`
      const [result] = await connection.execute(statement, [videoId])
      for (let key in result) {
        // const statement2 = `
        // SELECT c.*, JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
        // FROM comment c
        // LEFT JOIN user u ON c.user_id = u.id
        // WHERE comment_id = ?`
        const statement2 = `
        SELECT if(cl.comment_id is null,false,true) as isLike, t.* from 
        (SELECT c.*, JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
        FROM comment c
        LEFT JOIN user u ON c.user_id = u.id
        WHERE comment_id = ?) t
        LEFT JOIN  comment_like cl ON t.user_id =cl.user_id and t.id=cl.comment_id;`
        const [result2] = await connection.execute(statement2, [result[key].id])
        result[key].replyComment = result2
        result[key].showReply = false
      }

      return result
    } catch (err) {
      console.log(err)
    }
  }
  async createCommentLike(userId, commentId) {
    try {
      const statement = `INSERT INTO comment_like (user_id,comment_id) VALUES(?,?);`
      const statement2 = `UPDATE comment SET comment_like = comment_like+1 WHERE id = ?;`
      const result = await connection.execute(statement, [userId, commentId])
      const result2 = await connection.execute(statement2, [commentId])
      return { message: '点赞评论成功' }
    } catch (err) {
      console.log(err)
    }
  }
  async commentUnlike(userId, commentId) {
    try {
      const statement = `DELETE FROM comment_like WHERE user_id = ? AND comment_id = ?;`
      const statement2 = `UPDATE comment SET comment_like = comment_like-1 WHERE id = ?;`
      const result = await connection.execute(statement, [userId, commentId])
      const result2 = await connection.execute(statement2, [commentId])
      return { message: '取消点赞评论成功' }
    } catch (err) {
      console.log(err)
    }
  }
}

module.exports = new CommentService()
