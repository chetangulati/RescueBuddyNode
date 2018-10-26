const {User} = require('./../db_models/user');

var authenticateAdmin = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      return Promise.reject();
    }
    else if (user.is_admin == false) {
      return Promise.reject("Unauthorised access");
    }
    req.user = user;
    req.token = token;
    next();
  }).catch((e) => {
    res.status(401).send({e});
  });
};

module.exports = {authenticateAdmin};
