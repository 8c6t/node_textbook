const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(403).send('로그인 필요');
  }
};

exports.isNotLoggedIn = (req, res, next) => {
  if(!req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/');
  }
};

exports.verifyToken = (req, res, next) => {
  try {
    
    /* 
      토큰 검증 후 토큰의 내용을 req.decoded에 대입
      jwt.verify(토큰, 토큰 비밀키)
     */
    req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  // 비밀키 불일치 혹은 토큰 만료
  } catch (error) {
    if(error.name === 'TokenExpiredError') {
      return res.status(419).json({
        code: 419,
        message: '토큰이 만료되었습니다',
      });
    }
    return res.status(401).json({
      code: 401,
      message: '유효하지 않은 토큰입니다',
    });
  }
}

exports.apiLimiter = new RateLimit({
  windowMs: 60 * 1000,  // 기준시간
  max: 1,   // 허용 횟수
  delayMs: 0,   // 호출 간격
  handler(req, res) {   // 제한 초과시 콜백 함수
    res.status(this.statusCode).json({
      code: this.statusCode,
      message: '1분에 한 번만 요청할 수 있습니다'
    });
  }
});

exports.deprecated = (req, res) => {
  res.status(410).json({
    code: 410,
    message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요'
  });
}