const {User} = require('./../db_models/user');
const {authenticate} = require('./../middleware/authenticate');

const _ = require('lodash');
const express = require('express');

var route = express.Router();

route.get('/',authenticate, async (req, res, next) => {
  try {
    var user = req.user._id;
    var data = await User.findOne(user);
    data = _.pick(data, ["email", "contact", "age", "weight", "height", "gender", "name", "lon", "lat", "address"]);
    res.send(data);
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
});

route.put('/', authenticate, async (req, res, next) => {
  try {
      var data = req.body;
      User.updateOne({_id: req.user._id}, data).exec()
      .then((doc) => {
        res.send(doc);
      }).catch((e) => {
        res.status(400).send(e);
        console.log(e);
      })
  } catch (e) {
    res.status(500).send(e);
    console.log(e);
  }
})

module.exports = route;
