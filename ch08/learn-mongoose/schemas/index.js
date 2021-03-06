const mongoose = require('mongoose');

module.exports = () => {
  const connect = () => {
    if(process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true);
    }
    mongoose.connect('mongodb://nodejs:nodejs@localhost:27017/admin', {
      /*
        deprecated 관련 추가 설정(useNewUrlParser, useCreateIndex)
        참고: https://mongoosejs.com/docs/deprecations.html
       */
      useNewUrlParser: true,
      useCreateIndex: true,
      dbName: 'nodejs',
    }, (err) => {
      if(err) {
        console.log('몽고DB 연결 에러', err);
      } else {
        console.log('몽고DB 연결 성공');
      }
    });
  };

  connect();
  mongoose.connection.on('error', (err) => {
    console.error('몽고DB 연결 에러', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.error('몽고DB 연결이 끊겼습니다 .연결을 재시도합니다');
    connect();
  });

  // 몽구스 스키마 설정
  require('./user');
  require('./comment');
}