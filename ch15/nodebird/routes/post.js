const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { Post, Hashtag, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

fs.readdir('uploads', (err) => {
  if(err) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다');
    fs.mkdirSync('uploads');
  }
});

// multer 모듈에 옵션을 설정하여 사용
const upload = multer({
  // 저장 방식, 경로 및 파일 이름 설정
  // diskStorage: 서버 디스크에 저장
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, new Date().valueOf() + '_' + path.basename(file.originalname, ext) + ext);
    },
  }),
  // 최대 이미지 파일 용량 제한
  limits: { fileSize: 5 * 1024 * 1024 },
});

// single(속성명): 하나의 이미지 업로드 시 사용하는 미들웨어. req.file 객체를 생성
router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

// 게시글 업로드를 처리하는 라우터
const upload2 = multer();
// none(): 이미지 없이 데이터만 multipart 형식으로 전송 시 사용하는 미들웨어
router.post('/', isLoggedIn, upload2.none(), async(req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      userId: req.user.id,
    });
    // 정규표현식. # + 공백 제외([^\s]) + 모든 문자(*)
    const hashtags = req.body.content.match(/#[^\s]*/g);
    if(hashtags) {
      const result = await Promise.all(hashtags.map(tag => Hashtag.findOrCreate({
        where: { title: tag.slice(1).toLowerCase() },
      })));
      await post.addHashtags(result.map(r => r[0]));
    }

    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get('/hashtag', async (req, res, next) => {
  // 쿼리스트링으로 해시태그 이름을 찾음
  const query = req.query.hashtag;
  // 해시태그가 빈 문자열인 경우 메인 페이지로 리다이렉트
  if(!query) {
    return res.redirect('/');
  }

  try {
    // 해당 해시태그가 DB에 존재하는지 확인
    const hashtag = await Hashtag.findOne({ where: { title: query } });

    let posts = [];
    // 해시태그 존재 시 관련 게시글을 모두 가져옴(JOIN)
    if(hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }

    return res.render('main', {
      title: `${query} | NodeBird`,
      user: req.user,
      twits: posts,
    });
    
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;