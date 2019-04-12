var express = require('express');
var { User, Comment } = require('../models');

var router = express.Router();

/* 
// ### Promise
router.get(':/id', (req, res, next) => {
  Comnent.findAll({
    include: {
      model: User,
      where: { id: req.params.id },
    },
  })
    .then((comments) => {
      console.log(comments);
      res.json(comments);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
*/

// ### async-await
router.get('/:id', async (req, res, next) => {
  try {
    const comments = await Comment.findAll({
      include: {
        model: User,
        where: { id: req.params.id },
      },
    });

    console.log(comments);
    res.json(comments);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 
// ### Promise
router.post('/', (req, res, next) => {
  Comment.create({
    commenter: req.body.id,
    comment: req.body.comment,
  })
    .then((result) => {
      console.log(result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
 */

// ### async-await
router.post('/', async (req, res, next) => {
  try {
    const result = await Comment.create({
      commenter : req.body.id,
      comment: req.body.comment,
    });
    
    console.log(result);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 
// ### Promise
router.patch('/:id', (req, res, next) => {
  Comment.update(
    { comment: req.body.comment },
    { where : { id: req.params.id } }
  )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
 */

// ### async-await
router.patch('/:id', async (req, res, next) => {
  try {
    const result = await Comment.update(
      { comment: req.body.comment },
      { where: { id: req.params.id } },
    );
    
    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

/* 
// ### Promise
router.delete('/:id', (req, res, next) => {
  Comment.destroy( { where: { id: req.params.id} } )
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
});
 */

// ### async-await
router.delete('/:id', async (req, res, next) => {
  try {
    const result = await Comment.destroy({
      where : { id : req.params.id },
    });

    console.log(result);
    res.json(result);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;