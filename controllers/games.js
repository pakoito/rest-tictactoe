var authorize = require('../filters/authorize');
var games = [];
var _ = require('underscore');

function openGames(username) {
  return _.reject(games, function(game) {
    return game.player1 == username;
  });
}

function init(app) {
  app.get('/opengames', authorize.filter, function(req, res) {
    res.send({ games: openGames(req.authorization.basic.username) });
  });

  app.post('/new', authorize.filter, function(req, res) {
    var game = { };
    games.push({ player1: req.authorization.basic.username });
    res.send({ });
  });
}

function reset() {
  games.length = 0;
}

exports.init = init;
exports.reset = reset;
