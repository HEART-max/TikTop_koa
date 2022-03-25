const Multer = require('koa-multer')
const KoaBody = require('koa-body')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const cp = require('child_process')
const { AVATAR_PATH, VIDEO_PATH, PREVIEW_PATH } = require('../constants/file-path')

// const pictureUpload = Multer({
//   dest: `${VIDEO_PATH}`,
// })
// const pictureHandler = pictureUpload.array('picture', 9)

// 头像处理
const storageAvatar = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, AVATAR_PATH)
  },
  filename: function (req, file, cb) {
    const type = file.mimetype.split('/')[1]
    cb(null, `${Date.now()}.${type}`)
  },
})
const avatarUpload = Multer({ storage: storageAvatar })
const avatarHandler = avatarUpload.single('avatar')
// 视频处理
const storageVideo = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, VIDEO_PATH)
  },
  filename: function (req, file, cb) {
    const type = file.mimetype.split('/')[1]
    cb(null, `${Date.now()}.${type}`)
  },
})
const videoUpload = Multer({ storage: storageVideo })
const videoHandler = videoUpload.single('video')

// 视频二次处理
const VideoSecondaryHandler = async (ctx, next) => {
  const { filename, mimetype, size } = ctx.req.file
  // 提取视频第一帧 保存为图片
  // pathFile：原文件地址/原文件名.jpg
  // saveFilePath：要保存到哪/文件名.jpg
  const previewName = `${filename.split('.')[0]}.png` // 获取文件名称
  const pathFile = path.join(__dirname, '../../', `${VIDEO_PATH}/${filename}`)
  const saveFilePath = path.join(__dirname, '../../', `${PREVIEW_PATH}/${previewName}`)
  const execJpg = (pathFile, saveFilePath) => {
    cp.exec(
      `ffmpeg -i ${pathFile} -y -f image2 -frames 1 ${saveFilePath}`,
      function (res) {
        console.log('保存视频预览图成功')
      },
      function (err) {
        console.log(err)
      }
    )
  }
  execJpg(pathFile, saveFilePath)
  await next()
}

module.exports = { avatarHandler, videoHandler, VideoSecondaryHandler }
