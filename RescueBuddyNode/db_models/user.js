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
  * keys
*/
var privateKey = fs.readFileSync('./keys/private.key', 'utf8');
var publicKey = fs.readFileSync('./keys/public.key', 'utf8');

/**
  * Schema defination
*/
var UserSchema = mongoose.Schema({
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
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }],
  is_admin: {
      type:Boolean,
      default:false
  },
  password: {
    type: String,
    minlength: 6,
  }
});

UserSchema.methods.generateAuthToken = function () {
  var user = this;
  var access = 'auth';
  var token = jwt.sign({_id: user._id.toHexString(), access}, 'RescueBuddy').toString();
  user.tokens.push({access, token});
  console.log(token);
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


//to verify token for admin
UserSchema.statics.findByTokenAdmin = function (token) {
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
    'tokens.access': 'auth',
    'is_admin': true
  });
};

//Get all registered UserSchema
UserSchema.statics.getAllUsers = function(){
  var User = this;
  return User.find().select('_id email contact age gender name lon lat password date').then((users)=>{
    return new Promise((resolve, reject) =>{
      resolve(users);
    });
  })
  .catch(err=>{
    console.log(err);
    return Promise.reject();
  });
}

UserSchema.statics.findByCredentials = function (contact) {
  var User = this;
  return User.findOne({contact}).select('_id contact').then((user) => {
    if (!user) {
      return Promise.reject();
    }
    return new Promise((resolve, reject) => {
      resolve(user);
    });
  });
};


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
      bcrypt.compareSync(pass ,user.password, (errors, result) => {
        if(errors)
          console.log(errors);
        else {
          if(result==true){
            return new Promise((resolve, reject)=>{
              resolve(user);
            });
          }
        }
        });
      return Promise.reject();
    });
}

var User = mongoose.model('User', UserSchema);
module.exports = {User};
