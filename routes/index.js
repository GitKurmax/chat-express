const {User} = require('../models/user');
const HttpError = require('../error').HttpError
const ObjectID = require('mongodb').ObjectID
module.exports = function (app) {

  app.get('/users', (req, res, next) => {
    User.find({}, function (err, users) {
      if(err) return next(err)
      res.send(users)
    })
  });

  app.get('/user/:id', (req, res, next) => {
    let id
    try {
      id = new ObjectID(req.params.id)
    } catch (e) {
      return next(404)
    }

    User.findById(id, function (err, user) {
      if(err) return next(err)
      if(!user) {
        next(new HttpError(404, "User not found"))
      } else {
        res.send(user)
      }
    })
  });
}
