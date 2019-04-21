/* 
const WebSocker = require('ws');

// 서버 객체를 변수로 받아 소켓 연결
module.exports = (server) => {
  const wss = new WebSocker.Server({ server });

  // connection: 클라이언트와 서버가 웹소켓 연결 맺을 때 발생
  wss.on('connection', (ws, req) => {
    // 클라이언트 IP 획득 방법
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(`새로운 클라이언트 접속 ${ip}`);

    // message: 클라이언트로부터 메시지가 왔을 때
    ws.on('message', (message) => {
      console.log(message);
    });

    // error: 웹소켓 연결 중 문제 발생했을 때
    ws.on('error', (error) => {
      console.error(error);
    });

    // close: 클라이언트와 연결 끊겼을 때
    ws.on('close', () => {
      console.log(`클라이언트 접속 해제 ${ip}`);
      // 생략 시 메모리 누수 발생
      clearInterval(ws.interval);
    });

    const interval = setInterval(() => {
      if(ws.readyState === ws.OPEN) {
        ws.send('서버에서 클라이언트로 메시지를 보냅니다');
      }
    }, 3000);

    ws.interval = interval;
  });
};
*/

const SocketIO = require('socket.io');
const axios = require('axios');

module.exports = (server, app, sessionMiddleware) => {
  const io = SocketIO(server, { path: '/socket.io' });
  // 라우터에서 io 객체를 사용할 수 있도록 설정(req.app.get('io'))
  app.set('io', io);

  // of(): socket.io에 네임스페이스 부여
  const room = io.of('/room');
  const chat = io.of('/chat');

  // io.use 메소드에 미들웨어 장착
  io.use((socket, next) => {
    // 미들웨어이므로 (req, res, next)를 파라미터로 전달
    sessionMiddleware(socket.request, socket.request.res, next);
  });

  room.on('connection', (socket) => {
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', () => {
      console.log('room 네임스페이스 접속 해제');
    });
  });

  chat.on('connection', (socket) => {
    console.log('chat 네임스페이스에 접속');
    const req = socket.request;
    const { headers: { referer } } = req;

    const roomId = referer
      .split('/')[referer.split('/').length - 1]
      .replace(/\?.+/, '');

    // 네임스페이스보다 더 세부적인 개념으로, param에 해당하는 방(room) 생성
    socket.join(roomId);

    // socket.to(param): param 값의 방으로 데이터 전송
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다`,
    });

    socket.on('disconnect', () => {
      console.log('chat 네임스페이스 접속 해제');
      socket.leave(roomId);

      // param 값의 방에 참여 중인 소켓 정보
      const currentRoom = socket.adapter.rooms[roomId];
      
      const userCount = currentRoom ? currentRoom.length : 0;
      if(userCount === 0) {
        axios.delete(`http://localhost:8005/room/${roomId}`)
          .then(() => { console.log('방 제거 요청 성공'); })
          .catch((err) => { console.error(err); });
      } else {
        socket.to(roomId).emit('exit', {
          user: 'system',
          chat: `${req.session.color}님이 퇴장하셨습니다`,
        });
      }
    });
  });

  /* 
  io.on('connection', (socket) => {
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log('새로운 클라이언트 접속', ip, socket.id, req.ip);

    socket.on('disconnect', () => {
      console.log('클라이언트 접속 해제', ip, socket.id);
      clearInterval(socket.interval);
    });

    socket.on('reply', (data) => {
      console.log(data);
    });
    
    socket.on('error', (err) => {
      console.error(err);
    });

    socket.interval = setInterval(() => {
      socket.emit('news', 'Hello Socket.IO');
    }, 3000);
  });
  */
};