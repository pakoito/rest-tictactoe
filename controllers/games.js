var authorize = require('../filters/authorize');
var games = [];
var _ = require('underscore');
var uuid = require('node-uuid');

function openGames(username) {
  return _.reject(games, function(game) {
    return game.player1 == username || game.player1 && game.player2;
  });
}

function findGame(id) {
  return _.find(games, function(game) {
    return game.id == id;
  });
}

function username(req) {
  return req.authorization.basic.username;
}

function gamesForUser(username) {
  return _.filter(games, function(game) {
    return game.player1 == username || game.player2 == username 
  });
}

function init(app) {
  app.get('/opengames', authorize.filter, function(req, res) {
    var open = openGames(username(req));

    open = _.map(open, _.clone);

    _.each(open, function(g) {
      g.join = { method: "post", url: "/join?id=" + g.id }
    });
    
    res.send({
      games: open
    });
  });

  app.post('/join', function(req, res) {
    findGame(req.params.id).player2 = req.authorization.basic.username;

    res.send({ });
  });

  app.get('/inprogress', function(req, res) {
    var inprogress = gamesForUser(req.authorization.basic.username);

    res.send({ games: inprogress });
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
