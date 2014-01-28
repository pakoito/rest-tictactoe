var restify = require('restify');
var _ = require('underscore');
var yaml = require('json2yaml');
var docs = require('./controllers/docs');
var root = require('./controllers/root');
var games = require('./controllers/games');
var tictactoe = require('./controllers/tictactoe');
var authentication = require('./controllers/authentication');
var authorize = require('./authorize');

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

app.on('uncaughtException', function(req, res, route, err) {
  console.log(err.stack);
  res.send({ error: err.stack })
});

authentication.init(app);
docs.init(app);
root.init(app);
games.init(app);
tictactoe.init(app);

function toYaml(json) {
  return yaml.stringify(json);
}

function isCurl(req) {
  return req.headers["user-agent"].match(/curl/);
}

app.post('/reset', function(req, res) {
  games.reset();
  authentication.reset();
  res.send({ });
});

app.get('/encode/:username/:password', function(req, res) {
  res.send({
    result: new Buffer(req.params.username + ":" + req.params.password).toString('base64'),
    params: req.params
  });
});

app.listen(3000, function () {
  console.log('%s listening at %s', app.name, app.url);
});
