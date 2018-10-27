const {Items} = require('./../db_models/items');
const {authenticateAdmin} = require('./../middleware/authenticateAdmin');
const {authenticate} = require('./../middleware/authenticate');

const express = require('express');

var route = express.Router();

route.get('/',authenticate, (req, res, next) => {
  Items.find().select('_id name description min_count max_count expiry weight type').then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  })
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
