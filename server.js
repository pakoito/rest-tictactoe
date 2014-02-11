var restify = require('restify');
var yaml = require('json2yaml');
var docs = require('./controllers/docs');
var root = require('./controllers/root');
var games = require('./controllers/games');
var tictactoe = require('./controllers/tictactoe');
var dev = require('./controllers/dev');
var authentication = require('./controllers/authentication');

var app = restify.createServer({
  name: 'rest-tictactoe',
  version: '1.0.0'
});

app.formatters['text/plain'] = function(req, res, body) {
  return yaml.stringify(body);
};

app.use(restify.queryParser());
app.use(restify.bodyParser());
app.use(restify.authorizationParser());

app.use(function(req, res, next) {
  if(req.headers["user-agent"].match(/curl/) &&
    req.headers.accept == "*/*") {
    res.setHeader('content-type', 'text/plain');
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
dev.init(app);

app.listen(3000, function () {
  console.log('%s listening at %s', app.name, app.url);
});
