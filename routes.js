'use strict';

const express = require('express');
const router = express.Router();
const Question = require("./models").Question;

//Will get executed when qId is present
router.param("qId", (req, res, next, id) => {
  Question.findById(id, (err, doc) => {
    if (err) {
      return next(err);
    }
    if (!doc) {
      err = new Error("Not Found");
      err.status = 404;
      return next(err);
    }
    req.question = doc;
    return next();
  });
});

router.param("aId", (req, res, next, id) => {
  req.answer = req.question.answers.id(id);
  if (!req.answer) {
    const err = new Error("Not Found");
    err.status = 404;
    return next(err);
  }
  next();
});


router.get('/questions', (req, res) => {
  Question.find({})
    .sort({
      createdAt: -1
    })
    .exec((err, questions) => {
      if (err) {
        return next(err);
      }
      res.json(questions);
    });
});

router.post('/questions', (req, res, next) => {
  const question = new Question(req.body);
  question.save((err, question) => {
    if (err) {
      return next(err)
    }
    res.status(201);
    res.json(question);
  });
})

router.get("/questions/:qId", (req, res, next) => {
  res.json(req.question);
});


router.post('/questions/:qId/answers', (req, res, next) => {
  req.question.answers.push(req.body);
  req.question.save((err, question) => {
    if (err) {
      return next(err)
    }
    res.status(201);
    res.json(question);
  });
});

// PUT /questions/:qId/answers/:aId//
router.put("/questions/:qId/answers/:aId", (req, res, next) => {
  req.answer.update(req.body, (err, docs) => {
    if (err) {
      return next(err)
    }
    res.json(result);
  });
});

router.delete("/questions/:qId/answers/:aId", (req, res, next) => {
  req.answer.remove((err) => {
    if (err) {
      return next(err);
    }
    req.question.save((err, question) => {
      if (err) {
        return next(err);
      }
      res.json(question);
    });
  });
});

router.delete("/questions/:qId", (req, res, next) => {
  req.question.remove((err) => {
    if (err) {
      return next(err);
    }
    res.status(200);
    res.json({
      "success": {
        "status": 200,
        "message": `Question ${req.question._id} removed.`
      }
    });
  })
});

router.post("/questions/:qId/answers/:aId/vote-:dir", (req, res, next) => {
    if (req.params.dir.search(/^(up|down)$/) === -1) {
      const err = new Error("Not Found");
      next(err);
    } else {
      req.vote = req.params.dir;
      next();
    }
  },
  (req, res, next) => {
    req.answer.vote(req.vote, (err, question) => {
      if (err) return next(err);
      res.json(question);
    });
  });

module.exports = router;
