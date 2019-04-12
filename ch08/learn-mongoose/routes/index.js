var express = require('express');
var router = express.Router();
var User = require('../schemas/user');


router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({});
    res.render('mongoose', { users });  
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
