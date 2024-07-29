// 웹 소켓을 설정해주기 위한 파일
/*
 * HTTP를 사용해 서버를 만들고, 여기다가 웹 소켓과 DB를 올린다.
 * */
const { createServer } = require('http');
const app = require('./app');
const { Server } = require('socket.io'); // 웹 소켓
require('dotenv').config();

const httpServer = createServer(app); // app에 있는 DB 연결 부분을 올린다.

// io는 input/ouput의 줄임말로 웹 소켓의 국룰인 이름이다.
const io = new Server(httpServer, {
  // 웹 소켓 서버 생성
  cors: {
    // 웹 소켓도 app.js 처럼 cors 설정을 해줘야 한다. 허락한 대상만 통신할 수 있도록
    origin: 'https://globalnomad-5-8.netlify.app/', // 프론트엔드 주소
  },
});

require('./utils/io')(io); //io 매개변수를 io.js에서 가져옴

httpServer.listen(process.env.SERVER_PORT, () => {
  // 앱 서버
  console.log('Server listening on port:', process.env.SERVER_PORT);
});
