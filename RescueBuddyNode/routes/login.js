const {User} = require('./../db_models/user');

const _ = require('lodash');
const express = require('express');

var route = express.Router();

//user login
route.post('/', (req, res) => {
  var body = _.pick(req.body, ['contact']);

  User.findByCredentials(body.contact).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).json();
      });
    }).catch((err) => {
      res.status(401).send({err});
      // console.log(err);
    });
});

//admin login
route.post('/admin', (req, res) => {
  var body = _.pick(req.body, ['contact', 'password']);
  User.findByCredentialAdmin(body.contact, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).json({"success":"true"});
      });
    }).catch((err) => {
      res.status(401).send({err});
      console.log(err);
    });
});

module.exports = route;
