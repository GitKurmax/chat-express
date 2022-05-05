const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon')
const HttpError = require('./error').HttpError
const session = require('express-session')
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo')
const config = require('./config');
const errorHandler = require('errorhandler')

require('dotenv').config();

const app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'))
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  key: 'sid',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null
  },
  store: MongoStore.create({
    mongoUrl: config.get('mongoose:uri')
  })
}))
// app.use(function (req, res, next) {
//   req.session.numberOfVisits = req.session.numberOfVisits +1 || 1
//   res.send({visits: req.session.numberOfVisits})
// })

app.use(require('./middleware/sendHttpError'))
app.use(express.static(path.join(__dirname, 'public')));
require('./routes')(app)
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

module.exports = app;
