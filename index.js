const { createServer } = require('http');
const app = require('./app');
const { Server } = require('socket.io'); // 웹 소켓
const mongoose = require('mongoose'); // Mongoose 추가
const dotenv = require('dotenv');

// Load environment variables from .env file, depending on the environment
const envFile = `.env.${process.env.NODE_ENV || 'development'}`;
dotenv.config({ path: envFile });

const httpServer = createServer(app); // Express 애플리케이션을 사용하여 HTTP 서버를 생성

const io = new Server(httpServer, {
  // 웹 소켓 서버 생성
  cors: {
    origin: process.env.CORS_ORIGIN, // 프론트엔드 주소
    methods: ['GET', 'POST'],
  },
});

require('./utils/io')(io); // io 매개변수를 io.js에서 가져옴

// MongoDB 연결
mongoose
  .connect(process.env.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

httpServer.listen(process.env.SERVER_PORT, () => {
  // 앱 서버
  console.log('Server listening on port:', process.env.SERVER_PORT);
});
