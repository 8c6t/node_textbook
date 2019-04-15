const express = require('express');
const axios = require('axios');

const router = express.Router();

// const URL = 'http://localhost:8002/v1';
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:8003'; // origin 헤더 추가

/* 
  axios.get(주소, { headers: { 헤더 } })
  axios.post(주소, { 데이터 })
*/
const request = async (req, api) => {
  try {
    // 토큰 데이터가 없는 경우 API 서버에 요청
    if(!req.session.jwt) {
      const tokenResult = await axios.post(
        `${URL}/token`,
        { clientSecret: process.env.CLIENT_SECRET }
      );

      // 전달받은 토큰 데이터를 세션에 보관
      // data: 서버에서 반환한 데이터(res.json()에 담긴 객체)
      req.session.jwt = tokenResult.data.token;
    }

    return await axios.get(
      `${URL}${api}`, 
      { headers: { authorization: req.session.jwt } }
    );

  } catch (error) {
    console.error(error);
    // 의도된 에러의 경우 에러 메시지를 반환
    if(error.response.status < 500) {
      return error.response;
    }
    throw error;
  }
};

router.get('/mypost', async (req, res, next) => {
  try {
    const result = await request(req, '/posts/my');
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/search/:hashtag', async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,
    );
    res.json(result.data);
  } catch (error) {
    if(error.code) {
      console.error(error);
      next(error);
    }
  }
});

router.get('/test', async (req, res, next) => {
  try {
    if(!req.session.jwt) {  // 세션에 토큰이 없는 경우
      const tokenResult = await axios.post(
        `${URL}/token`, 
        { clientSecret: process.env.CLIENT_SECRET }
      );
      
      // 토큰 발급 성공
      if(tokenResult.data && tokenResult.data.code === 200) {
        req.session.jwt = tokenResult.data.token;  // 세션에 토큰 저장
      // 토큰 발급 실패
      } else {
        return res.json(tokenResult.data);  // 발급 실패 사유 응답
      }
    }

    // 발급된 토큰 테스트
    const result = await axios.get(
      'http://localhost:8002/v1/test',
      { headers: { authorization: req.session.jwt }}
    );
    
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    // 토큰 만료 시
    if(error.response.status === 419) {
      return res.json(error.response.data);
    }
    return next(error);
  }
});

router.get('/', (req, res) => {
  res.render('main', { key : process.env.CLIENT_SECRET });
});

module.exports = router;