const {Items} = require('./../db_models/items');
const {User} = require('./../db_models/user');
const {authenticateAdmin} = require('./../middleware/authenticateAdmin');
const {authenticate} = require('./../middleware/authenticate');

const express = require('express');

var route = express.Router();

route.get('/',authenticate, async (req, res, next) => {
  try {
    var user = await User.findById(req.user._id);
    var bmi = (user.height*1000)/(user.weight*user.weight);
    var perc = 0.15;
    if((bmi < 18.5 && bmi > 24.9) && (user.age > 15 && user.age < 45)) perc = 0.2;
    var weight = user.weight*perc;
    Items.find().then((items) => {
      res.send({items, weight});
    }).catch((err) => {
      res.status(400).send(err);
    });
  } catch (e) {
    res.status(500).send({"err": "Server Error Occoured"});
  }
});

route.post('/admin', authenticateAdmin, (req, res, next) => {
  var body = req.body;
  var data = new Items(body);
  // change to data not Items
  data.save().then(() => {
    res.send({"success": "true"});
  }).catch((err) => {
    res.status(400).send(err);
  })
});

module.exports = route;
