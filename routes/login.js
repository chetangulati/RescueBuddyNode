const {User} = require('./../db_models/user');

const request = require('request');
const _ = require('lodash');
const express = require('express');

var route = express.Router();

route.post('/', (req, res) => {
  var body = _.pick(req.body, ['contact']);

  User.findByCredentials(body.contact).then((user) => {
      return user.generateAuthToken().then((token) => {
        res.header('x-auth', token).send();
      });
    }).catch((err) => {
      res.status(401).send({body});
      console.log(err);
    });
});

route.post('/otp', (req, res, next) => {

});

module.exports = route;
