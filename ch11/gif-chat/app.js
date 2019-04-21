const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const ColorHash = require('color-hash');

require('dotenv').config();

const webSocket = require('./socket');
const indexRouter = require('./routes');

const connect = require('./schemas');

const app = express();
connect();

// 미들웨어 공유를 위해 변수로 분리
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8005);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/gif', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);

app.use(flash());

// 고유 색상 생성 미들웨어
app.use((req, res, next) => {
  if(!req.session.color) {
    const colorHash = new ColorHash();
    req.session.color = colorHash.hex(req.sessionID); // sessionId(x)
  }
  next();
});

app.use('/', indexRouter);

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

const port = app.get('port');
const server = app.listen(port, () => {
  console.log(`${port}번 포트에서 대기 중`);
});

// 익스프레스 서버와 웹소켓 서버 연결
webSocket(server, app, sessionMiddleware);