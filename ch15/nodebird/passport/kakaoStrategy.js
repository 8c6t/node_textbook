const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new KakaoStrategy({
    // 카카오에서 발급해주는 API ID
    clientID: process.env.KAKAO_ID,
    // 인증 결과를 받을 주소
    callbackURL: '/auth/kakao/callback',
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // 기존에 카카오로 로그인한 사용자가 있는지 검색
      const exUser = await User.findOne({ where: { snsId: profile.id, provider: 'kakao' } });
      // 있으면 done 함수 호출
      if(exUser) {
        done(null, exUser);
      // 없다면 가입 진행
      } else {
        // 인증 후 받은 값을 이용하여 회원가입 진행
        const newUser = await User.create({
          email: profile._json && profile._json.kaccount_email,
          nick: profile.displayName,
          snsId: profile.id,
          provider: 'kakao',
        });
        // 가입 후 done 함수 호출
        done(null, newUser);
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};