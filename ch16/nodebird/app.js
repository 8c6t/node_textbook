const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const helmet = require('helmet');
const hpp = require('hpp');
const RedisStore = require('connect-redis')(session);

// 환경 변수
require('dotenv').config();

// 라우터 import
const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

// 시퀄라이즈
const { sequelize } = require('./models');

// 패스포트 설정
const passportConfig = require('./passport');

// 윈스턴 설정
const logger = require('./logger');

// 앱 기본 설정
const app = express();
sequelize.sync();
passportConfig(passport);

// 익스프레스 기본 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

// 세션 옵션
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  }, 
  store: new RedisStore({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    logErrors: true,
  }),
};

// 미들웨어 설정
if(process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
  app.use(helmet());
  app.use(hpp());

  sessionOption.proxy = true;
} else {
  app.use(morgan('dev'));
}

app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded( { extended : false } ));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session(sessionOption));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// 라우터 설정
app.use('/', pageRouter);
app.use('/auth', authRouter);
app.use('/post', postRouter);
app.use('/user', userRouter);

// 404 에러 설정
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  logger.info('hello');
  logger.error(err.message);
  next(err);
});

// 에러 페이지 설정
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = app.get('port');
app.listen(port, () => {
  console.log(`${port}번 포트에서 대기 중`);
});