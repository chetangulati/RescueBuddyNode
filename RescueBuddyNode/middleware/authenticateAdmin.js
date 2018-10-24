const {User} = require('./../db_models/user');

var authenticateAdmin = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByTokenAdmin(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send();
  });
};
module.exports = {authenticateAdmin};
