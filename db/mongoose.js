const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://spaceapps:BzwYM9Xf4fJUmp6PU8na1ylOUkHcH0ECLzgGBoVvVg3p3H0gPEoHQhqEcEDGcPX6TFYrGQRBMTxdObmrLSDaDg%3D%3D@spaceapps.documents.azure.com:10255/?ssl=true',{useNewUrlParser: true}, (err, db) => {
  if(err) return console.log('Unable to connect to database');
  console.log('Connected to server successfully');
});

module.exports = {mongoose};
