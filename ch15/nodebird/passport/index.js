const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

// passport 모듈을 app.js에서 파라미터로 받음
module.exports = (passport) => {
  // 사용자 정보 객체 세션에 아이디로 저장
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // 세션에 저장한 아이디를 통해 사용자 정보 객체를 DB에서 호출
  passport.deserializeUser((id, done) => {
    User.findOne({
      where: { id },
      include: [{
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followers',
      }, {
        model: User,
        attributes: ['id', 'nick'],
        as: 'Followings',
      }],
    })
      .then(user => done(null, user))
      .catch(err => done(err));
  });

  local(passport);
  kakao(passport);
}
