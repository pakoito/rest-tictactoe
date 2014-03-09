var authorize = require('../filters/authorize');
var games = [];
var _ = require('underscore');
var uuid = require('node-uuid');
var engine = require('../models/engine');
var querystring = require('querystring');

function openGames(username) {
  return _.reject(games, function(game) {
    return game.player1 == username || game.player1 && game.player2;
  });
}

function findGame(id) {
  return _.findWhere(games, { id: id });
}

function gamesForUser(username) {
  return _.filter(games, function(game) {
    return game.player1 == username || game.player2 == username 
  });
}

function linksFor(game) {
  return _.chain(engine.variations(game.board))
    .map(function(entry, key) {
      entry.id = game.id;
      return [key, { method: "post", url: "/move?" + querystring.stringify(entry) }];
    })
    .object()
    .value();
}

function currentTurn(game) {
  if(engine.turn(game.board) == "x") return game.player1;

  return game.player2;
}

function newGame(req, res) {
  var game = {
    id: uuid.v1(),
    player1: req.username,
    board: { }
  };

  games.push(game);
  res.send({ });
  return game;
}

function join(req, res) {
  findGame(req.params.id).player2 = req.username;

  res.send({ });
}

function move(req, res) {
  var game = findGame(req.params.id);

  var newMoves = _.pick(req.params, _.keys(engine.availableMoves));

  game.board = _.extend(game.board, newMoves);

  res.send({ });
}

function init(app) {
  app.get('/opengames', authorize.filter, function(req, res) {
    var open = openGames(req.username);

    open = _.map(open, _.clone);

    _.each(open, function(g) {
      g.join = { method: "post", url: "/join?id=" + g.id }
    });
    
    res.send({ games: open });
  });

  app.post('/join', join);

  app.post('/move', move);

  app.get('/inprogress', function(req, res) {
    var inprogress = gamesForUser(req.username);

    inprogress = _.map(inprogress, _.clone);

    _.each(inprogress, function(game) {
      if(currentTurn(game) == req.username) {
        game.turn = linksFor(game);
      }
    });
    
    res.send({ games: inprogress });
  });

  app.post('/new', authorize.filter, newGame);
}

function reset() {
  games.length = 0;
}

exports.init = init;
exports.reset = reset;
exports.newGame = newGame;
exports.games = function() { return games; }
exports.linksFor = linksFor;
exports.join = join;
exports.move = move;
