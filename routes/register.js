const {User} = require('./../db_models/user');

const express = requrire('express');

var route = express.Router();

route.post('/register', (req, res) => {
  var body = _.pick(req.body, ['email','contact','age','gender','name','address','height','weight']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send();
  }).catch((err) => {
    res.status(400).send({err});
  });
});

module.exports = route;
