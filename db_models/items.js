const {mongoose} = require('./../db/mongoose');

var itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1
  },
  description: {
    type: String,
    required: true,
    minlength: 1
  },
  icon:{
    type: String,
    minlength: 1
  },
  min_count:{
    type: Number,
    required: true,
    minlength: 1
  },
  max_count: {
    type: Number,
    required: true,
    minlength: 1
  },
  expiry:{
    type: Number,
    required: true,
    minlength: 1
  },
  weight: {
    type: Number,
    required: true,
    minlength: 1
  },
  type:{
    type: Boolean,
    required: true,
  }
});

var Items = mongoose.model('items', itemSchema);
module.exports = {Items};
