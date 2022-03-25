const connections = require('../app/database')
class VideoService {
  // 根据页码获取所有视频
  async getVideoList(userId, offset, size) {
    try {
      if (userId !== 0) {
        const statement = `
        SELECT if(l.video_id is null,false,true) as isLike, t.* from 
        (SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
        FROM video v 
        LEFT JOIN user u ON v.user_id = u.id) t
        LEFT JOIN  video_like l ON  t.id=l.video_id and l.user_id = ?
        ORDER BY t.id DESC
        LIMIT ?,?;`
        const [result] = await connections.execute(statement, [userId, offset, size])
        for (let key in result) {
          const statement2 = `SELECT * FROM attention WHERE user_id = ? AND user2_id = ?`
          const [result2] = await connections.execute(statement2, [userId, result[key].user_id])
          if (result2.length !== 0) {
            result[key].isFollow = true
          } else {
            result[key].isFollow = false
          }
        }
        return result
      } else {
        const statement = `
        SELECT if(l.video_id is null,false,true) as isLike, t.* from 
        (SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
        FROM video v
        LEFT JOIN user u ON v.user_id = u.id) t 
        LEFT JOIN  video_like l ON  t.id=l.video_id
        ORDER BY t.id DESC
        LIMIT ?,?;`
        const [result] = await connections.execute(statement, [offset, size])
        for (let key in result) {
          const statement2 = `SELECT * FROM attention WHERE user_id = ? AND user2_id = ?`
          const [result2] = await connections.execute(statement2, [userId, result[key].user_id])
          if (result2.length !== 0) {
            result[key].isFollow = true
          } else {
            result[key].isFollow = false
          }
        }
        return result
      }
    } catch (err) {
      console.log(err)
    }
  }
  // 获取视频
  async getVideoByFilename(filename) {
    try {
      const statement = `SELECT * FROM video WHERE filename = ?;`
      const [result] = await connections.execute(statement, [filename])
      return result[0]
    } catch (err) {
      console.log(err)
    }
  }
  // 获取用户作品
  async getVideoByUserId(userId) {
    try {
      const statement = `
      SELECT if(vl.video_id is null,false,true) as isLike, t.* from 
      (SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
      FROM video v
      LEFT JOIN user u ON v.user_id = u.id
      WHERE user_id = ?) t 
      LEFT JOIN  video_like vl ON t.user_id =vl.user_id and t.id=vl.video_id;`
      const [result] = await connections.execute(statement, [userId])
      for (let key in result) {
        result[key].isFollow = false
      }
      return result
    } catch (err) {
      console.log(err)
    }
  }
  // 获取视频预览图
  async getPreviewInfoByFilename(filename) {
    try {
      const statement = `SELECT * FROM video WHERE filename = ?`
      const [result] = await connections.execute(statement, [filename])
      return result[0]
    } catch (err) {
      console.log(err)
    }
  }
  // 获取关注的人的视频
  async getFollowVideoById(userId) {
    try {
      const statement = `
      SELECT if(l.video_id is null,false,true) as isLike,b.* FROM
      (SELECT a.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user FROM
      (SELECT v.* from
      (SELECT * 
      FROM attention
      WHERE user_id = ?) t 
      INNER JOIN video v ON v.user_id = t.user2_id) a
      LEFT JOIN user u ON a.user_id = u.id) b
      LEFT JOIN  video_like l ON  b.id=l.video_id and l.user_id = ?`
      const [result] = await connections.execute(statement, [userId, userId])
      for (let key in result) {
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
  async getVideoListBySearchValue(userId, searchValue) {
    const statement = `
    SELECT if(l.video_id is null,false,true) as isLike, t.* from 
    (SELECT v.*,JSON_OBJECT('id',u.id,'email',u.email,'name',u.name,'avatar_url',u.avatar_url) user
    FROM video v 
    LEFT JOIN user u ON v.user_id = u.id) t
    LEFT JOIN  video_like l ON  t.id=l.video_id and l.user_id = ?
    WHERE t.video_desc LIKE ?
    ORDER BY t.id DESC`
    const [result] = await connections.execute(statement, [userId, `%${searchValue}%`])
    for (let key in result) {
      const statement2 = `SELECT * FROM attention WHERE user_id = ? AND user2_id = ?`
      const [result2] = await connections.execute(statement2, [userId, result[key].user_id])
      if (result2.length !== 0) {
        result[key].isFollow = true
      } else {
        result[key].isFollow = false
      }
    }
    return result
  }
}
module.exports = new VideoService()
