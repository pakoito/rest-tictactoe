var _ = require('underscore');
var users = [];

function usernameTaken(username) {
  return _.find(users, function(user) { 
    return user.username == username;
  })
}

function isAuthenticated(req) {
  if(!req.authorization.basic) return false;

  return !!_.filter(users, function(user) {
    return user.username == req.authorization.basic.username && user.password == req.authorization.password;
  });
}

function init(app) {
  app.use(function(req, res, next) {
    req.isAuthenticated = isAuthenticated(req);
    return next();
  });

  app.post('/register', function(req, res) {
    var u = req.authorization.basic.username;
    if(usernameTaken(u)) {
      res.send({ error: "username unavailable" });
    } else {
      var p = req.authorization.basic.password;
      var user = { username: u, password: p };
      users.push(user);
      res.send(user);
    }
  });
}

function reset() {
  users.length = 0;
}

exports.init = init;
exports.reset = reset;
