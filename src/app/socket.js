const Koa = require('koa')
const { createServer } = require('http')
const { Server } = require('socket.io')

const ws = new Koa()
const httpServer = createServer(ws.callback())
const io = new Server(httpServer, {
  //配置cors，解决同源策略问题
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
io.on('connection', (socket) => {
  console.log('socket连接成功~~~')
  socket.on('join', (data) => {
    console.log('加入的用户信息：', data)
  })
  socket.on('message', (data) => {
    console.log('客户端发送的内容：', data)
    socket.broadcast.emit('sendMsg', data)
  })
  socket.on('disconnecting', () => {
    console.log('连接断开了~~~')
  })
})
module.exports = httpServer
