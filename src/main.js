const app = require('./app/index')
const httpServer = require('./app/socket')
require('./app/database')
const config = require('./app/config')

app.listen(config.APP_PORT, () => {
  console.log(`服务器在${config.APP_PORT}端口启动成功！`)
})
httpServer.listen(config.WS_PORT, () => {
  console.log(`ws在${config.WS_PORT}端口连接成功`)
})
