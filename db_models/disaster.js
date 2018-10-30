const {mongoose} = require('./../db/mongoose');
const {Items} = require('./items');

var disasterSchema = mongoose.Schema({
  _id:{
    type: Number,
    required: true
  },
  disaster_name: {
    type: String,
    minlength: 1,
    required: true
  },
  disaster_desc: {
    type: String,
    minlength: 1,
    required: true
  },
  disaster_image:{
    type: String,
    minlength: 1
  },
  disaster_background_image:{
    type: String,
    minlength: 1,
  },
  disaster_video: {
    type: String,
    minlength: 1
  },
  shelter_steps: [{
    type: String,
    minlength: 1
  }],
  evac_steps: [{
    type: String,
    minlength: 1
  }],
  items:[{
    item_id:{
        type: String,
        required: true
    },
    priority:{
      type: Number,
      required: true,
      minlength: 1
    }
  }]
});

var disaster = mongoose.model('disaster', disasterSchema);
module.exports = {disaster};
