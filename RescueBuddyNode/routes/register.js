const {User} = require('./../db_models/user');
const bcrypt = require('bcryptjs');

const _ = require('lodash');
const express = require('express');

var route = express.Router();

//Normal User Registration
route.post('/', (req, res) => {
  var body = _.pick(req.body, ['email','contact','age','gender','name','address','height','weight', 'lon', 'lat']);
  var user = new User(body);
  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send();
  }).catch((err) => {
    console.log(err);
    res.status(400).send({err});
  });
});


//Admin Registration
route.post('/admin', (req, res) => {
  var body = _.pick(req.body, ['email','contact','age','gender','name','address','height','weight', 'lon', 'lat', 'password', 'is_admin']);
  body.password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(12));
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
