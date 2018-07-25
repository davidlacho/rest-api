'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const sortAnswers = function(a, b) {
  console.log(a);
  console.log(b);
  // - if a before
  // 0 if unchanged
  // + if a is sorted after b

  //Answers with most votes appear at top of list
  //if votes match, order by when they were last updated

  //if a has more votes, number returned will be negative, a before b
  if (a.votes === b.votes) {
    return b.updatedAt - a.updatedAt;
  }
  return b.votes - a.votes;

};

const AnswerSchema = new Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  votes: {
    type: Number,
    default: 0
  }
});

AnswerSchema.method('update', (updates, callback) => {
  Object.assign(this, update, {
    updatedAt: new Date()
  });
  this.parent().save(callback);
});

AnswerSchema.method('vote', function(vote, callback) {
  if (vote === "up") {
    this.votes += 1;
  } else { this.votes -= 1;
  }
  this.parent().save(callback);
});

const QuestionSchema = new Schema({
  text: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  answers: [AnswerSchema]
});

QuestionSchema.pre("save", function(next){
	this.answers.sort(sortAnswers);
	next();
});

const Question = mongoose.model('Question', QuestionSchema);
const Answers = mongoose.model('Answer', AnswerSchema);

module.exports.Question = Question;
