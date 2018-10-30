/**
  * Libraries import
*/
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const path = require('path');
const morgan = require('morgan');
const fs = require('fs');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const _ = require('lodash');

/**
  * Internal files import
*/
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');
var gobag = require('./routes/gobag');
var user = require('./routes/user');
// var {api} = require('./db_models/api');

/**
  * Objects defination
*/
var app = express();
var logStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' });

/**
  * Setting view engine
*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

/**
  * Middleware configuration
*/
app.use(express.json());
app.use(morgan('combined', {stream: logStream}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static('media/uploads/'));

/**
  * Routes configuration
*/
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);
app.use('/gobag', gobag);
app.use('/user', user);
/**
  * find api
*/
// app.post('/api', (req, res, next) => {
//   var api = {
//     "login"
//   }
// });

module.exports = app;

app.listen(process.env.PORT || 3000, (req, res, next) => {
  console.log("Server started at 3000 port");
});
