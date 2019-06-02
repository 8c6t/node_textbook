const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  // request의 body에서 회원가입에 필요한 정보를 식별자에 할당
  const { email, nick, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if(exUser) {
      req.flash('joinError', '이미 가입된 이메일입니다.');
      return res.redirect('/join');
    }
    // 비밀번호 해싱. 두번째 파라미터는 bcrypt cost factor
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nick,
      password: hash,
    });
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => { 
    // 인증 오류
    if(authError) {
      console.error(authError);
      return next(authError);
    }
    // 인증 실패 - 유저 미존재 혹은 비밀번호 오류
    if(!user) {
      req.flash('loginError', info.message);
      return res.redirect('/');
    }
    // 인증 성공
    return req.login(user, (loginError) => {
      if(loginError) {
        console.error(loginError);
        return next(loginError);
      }
      return res.redirect('/');
    });
  })(req, res, next);  // 미들웨어(router) 내의 미들웨어(passport)에는 (req, res, next)를 붙임
});

router.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// 카카오 로그인 전략
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('/');
});

module.exports = router;