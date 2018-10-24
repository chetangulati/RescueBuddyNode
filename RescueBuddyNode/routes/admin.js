const {User} = require('./../db_models/user');
const {authenticateAdmin} = require('./../middleware/authenticateAdmin');

const _ = require('lodash');
const express = require('express');

var route = express.Router();

//user login
route.get('/getAllUsers', authenticateAdmin, (req, res) => {
  
  User.getAllUsers().then((data) => {
      return res.status(200).json({"count": data.length, "users":data});
    }).catch((err) => {
      res.status(401).send({err});
      console.log(err);
    });
});


module.exports = route;
