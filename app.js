'use strict'

const express = require ('express');
const app = express();
const jsonParser = require ('body-parser').json;
const routes = require('./routes');
const logger = require('morgan');
const models = require('./models')

app.use(logger('dev'));
app.use(jsonParser());

//Mongo Connection:
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/qa');

const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log('DB connection success');
  // All db communication goes here.
});

// Routes:
app.use(routes);

// Express server:
const port = process.env.PORT || 3000;
app.listen(port, function(){
  console.log('👨🏻‍💻 Express server listening on port ' + port);
});


app.get('/:id', function(req, res, next) {
  res.send('Hi there, ' + req.params.id);
});

app.use(function(req, res, next) {
  const error = new Error ("Request Not Found");
  error.status = 404;
  next(error);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});
