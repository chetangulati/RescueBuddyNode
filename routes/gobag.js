const {Items} = require('./../db_models/items');

const express = require('express');

var route = express.Router();

route.get('/',authenticate, (req, res, next) => {
  Items.find().then((doc) => {
    res.send(doc);
  }).catch((err) => {
    res.status(400).send(err);
  })
});

route.post('/admin', authenticateAdmin, (req, res, next) => {
  var body = req.body;

  var data = new Items(body);
  Items.save().then(() => {
    res.send({"success": "true"});
  }).catch((err) => {
    res.status(400).send(err);
  })
});

module.exports = route;
