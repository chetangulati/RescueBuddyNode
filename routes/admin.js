const {User} = require('./../db_models/user');
const {authenticateAdmin} = require('./../middleware/authenticateAdmin');
const {disaster} = require('./../db_models/disaster');
const {Items} = require('./../db_models/items');

const _ = require('lodash');
const express = require('express');
const multer = require('multer');

var route = express.Router();
var upload = multer({dest: 'media/uploads', filename: function (req, file, cb) {
    cb(null, Date.now()+'.' + mime.extension(file.mimetype));
  }
});

//user login
route.get('/getAllUsers', authenticateAdmin, (req, res) => {

  User.getAllUsers().then((data) => {
      return res.status(200).json(data);
    }).catch((err) => {
      res.status(401).send({err});
      console.log("get All users endpoint " + err);
    });
});

route.post('/disaster', authenticateAdmin,upload.fields([{name: 'disaster_image', maxCount: 10},{name: 'disaster_background_image', maxCount: 1}]), (req, res, next) => {
  var d_img = req.files['disaster_image'];
  var b_img = req.files['disaster_background_image'];
  var body = req.body;
  body.disaster_image = d_img[0].filename;
  body.disaster_background_image = _.map(b_img, 'filename');
  try {
    body.shelter_steps = body.shelter_steps.split("#");
    body.evac_steps = body.evac_steps.split("#");

    var data = new disaster(body);
    data.save().then((result) => {
      res.status(200).send();
    }).catch((e) => {
      res.status(400).send("Bad request");
      console.log(e);
    });
  } catch (e) {
    res.status(500).send("Server Error");
    console.log(e);
  }
});

route.get('/item', authenticateAdmin, (req, res, next) => {
  Items.find().exec()
  .then((data) => {
    res.send(data);
  }).catch((err) => {
    res.status(500).send(err);
    console.log(err);
  })
});

route.delete('/item', authenticateAdmin, (req, res, next) => {
  var id = req.body._id;
  Items.findByIdandRemove(id).exec()
  .then((result) => {
    res.send({"status": "Deleted Successfully"});
    console.log(result);
  }).catch((err) => {
    res.status(500).send(err);
    console.log(err);
  })
});

route.put('/item', authenticateAdmin, (req, res, next) => {
  try {
      var data = req.body.update;
      Items.updateOne({_id: data.id}, data).exec()
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
});

module.exports = route;
