/**
  * Libraries import
*/
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const fs = require('fs')

/**
  * Files import
*/
const {mongoose} = require('./../db/mongoose');

/**
  * Schema defination
*/
var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 1,
  },
  age:{
    type: String,
    minlength: 1,
  },
  gender:{
    type: String,
    minlength: 1
  },
  height:{
    type: Number,
    minlength: 1
  },
  weight: {
    type: Number,
    minlength: 1
  },
  is_admin:{
    type: Boolean,
    required: true,
    default: false
  },
  date: {
    type: Date,
    required: true,
    default: new Date(),
  },
  lon:{
    type: Number,
    minlength: 1
  },
  lat:{
    type: Number,
    minlength: 1
  },
  email: {
    type: String,
    minlength: 1,
    unique: true,
    trim: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid E-Mail'
    }
  },
  regDevice: {
    type: String,
  },
  contact: {
    type: String,
    required: true,
    unique: true,
    length: 10,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  gobag: [{
    name:{
      type: String,
      required: true,
      minlength: 1
    },
    date:{
      type: Date,
      default: new Date()
    },
    recommended_items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'items'
    }],
    additional_items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'items'
    }]
  }],
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'RescueBuddy').toString();
  user.tokens.push({access, token});
  console.log("Hello world");
  return user.save().then(() => {
    return token;
  })
};

// UserSchema.methods.toJSON = function () {
//   var user = this;
//   var userObject = user.toObject();
//
//   return _.pick(userObject, ['_id', 'contact']);
// };


UserSchema.methods.removeToken = function (token) {
  var user = this;

  return user.update({
    $pull: {
      tokens: {token}
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  var User = this;
  var decoded;
  try {
    decoded = jwt.verify(token, 'RescueBuddy');
  } catch (e) {
    return Promise.reject();
  }

  return User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (contact, password) {
  var User = this;
  return User.findOne({contact}).then((user) => {
    console.log({user, contact});
    if (!user) {
      return Promise.reject("User Not found");
    }
    console.log(user);
    return new Promise((resolve, reject) => {
      // Use bcrypt.compare to compare password and user.password
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

//Get all registered UserSchema
UserSchema.statics.getAllUsers = function(){
  var User = this;
  return User.find({ is_admin: { $eq: false } }).select('_id email contact age gender name lon lat').then((users)=>{
    return new Promise((resolve, reject) =>{
      resolve(users);
    });
  })
  .catch(err=>{
    console.log(err);
    return Promise.reject();
  });
}

//Admin Checking findByCredentialsAdmin
UserSchema.statics.findByCredentialAdmin = function (contact, pass) {
  var User = this;
  return User.findOne({contact}).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    else if(user.is_admin == false){
        return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(pass, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
}


UserSchema.pre('save', function (next) {
  var user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model('User', UserSchema);

module.exports = {User};
