const {User} = require('./../db_models/user');
const {authenticate} = require('./../middleware/authenticate');

const _ = require('lodash');
const express = require('express');

var route = express.Router();

route.get('/', authenticate, (req, res, next) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }, () => {
    res.status(400).send();
  });
});

module.exports = route;
