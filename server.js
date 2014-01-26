var restify = require('restify');
var _ = require('underscore');
var users = [];
var yaml = require('json2yaml');
var docs = require('./docs');

var app = restify.createServer({
  name: 'rest-tictactoe',
  version: '1.0.0'
});

app.formatters['text/plain'] = function(req, res, body) {
  return toYaml(body);
};

app.use(restify.acceptParser(app.acceptable));
app.use(restify.queryParser());
app.use(restify.bodyParser());
app.use(restify.authorizationParser());

app.use(function(req, res, next) {
  if(isCurl(req) && req.headers.accept == "*/*") {
    req.headers.accept = "text/plain";
  }

  return next();
});

app.use(function(req, res, next) {
  req.isAuthenticated = isAuthenticated(req);
  return next();
});

app.on('uncaughtException', function(req, res, route, err) {
  console.log(err.stack);
  res.send({ error: err.stack })
});

docs.init(app);

app.get('/', function (req, res) {
  var urls = {
    alldocumentation: {
      method: 'get',
      notes: 'only returns text/plain',
      url: '/docs',
    },
    documentation: {
      method: 'get',
      notes: 'only returns text/plain',
      url: '/docs?for=:url',
      example: '/docs?for=/encode/:username/:password'
    },
    register: {
      method: 'post',
      url: '/register'
    },
    encode: {
      method: 'get',
      url: '/encode/:username/:password'
    }
  };

  if(req.isAuthenticated) {
    urls.newgame = {
      method: 'post',
      url: '/new'
    };
  }

  res.send(urls);
});

function toYaml(json) {
  return yaml.stringify(json);
}

function isCurl(req) {
  return req.headers["user-agent"].match(/curl/);
}

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

app.post('/reset', function(req, res) {
  users.length = 0;
  res.send({ });
});

app.get('/encode/:username/:password', function(req, res) {
  res.send({
    result: new Buffer(req.params.username + ":" + req.params.password).toString('base64'),
    params: req.params
  });
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

app.listen(3000, function () {
  console.log('%s listening at %s', app.name, app.url);
});
