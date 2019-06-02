const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {
    try {
      const exUser = await User.findOne({ where: { email } });
      // DB에 유저 존재
      if(exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        // 비밀번호 일치
        if(result) {
          done(null, exUser);
        // 비밀번호 불일치
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다' });
        }
      // DB에 유저 정보 없음
      } else {
        done(null, false, { message: '가입되지 않은 회원입니다' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};