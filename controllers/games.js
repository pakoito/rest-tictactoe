var authorize = require('../filters/authorize');
var games = [];
var _ = require('underscore');
var uuid = require('node-uuid');

function openGames(username) {
  return _.reject(games, function(game) {
    return game.player1 == username;
  });
}

function init(app) {
  app.get('/opengames', authorize.filter, function(req, res) {
    open = openGames(req.authorization.basic.username)
    _.each(open, function(g) {
      g.join = { method: "post", url: "/join?id=" + g.id }
    });
    
    res.send({
      games: open
    });
  });

  app.post('/join', function(req, res) {
    console.log(req.params);

    res.send({ });
  });

  app.post('/new', authorize.filter, function(req, res) {
    var game = {
      id: uuid.v1(),
      player1: req.authorization.basic.username
    };
    games.push(game);
    res.send({ });
  });
}

function reset() {
  games.length = 0;
}

exports.init = init;
exports.reset = reset;
