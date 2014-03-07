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

function linksFor(board) {
  return _.chain(engine.variations(board))
    .map(function(entry, key) {
      return [key, { method: "post", url: "/move?" + querystring.stringify(entry) }];
    })
    .object()
    .value();
}

function currentTurn(game) {
  if(engine.turn(game.board) == "x") return game.player1;

  return game.player2;
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

  app.post('/join', function(req, res) {
    findGame(req.params.id).player2 = req.username;

    res.send({ });
  });

  app.post('/move', function(req, res) {
    console.log('todo');
    
    res.send({ });
  });

  app.get('/inprogress', function(req, res) {
    var inprogress = gamesForUser(req.username);

    inprogress = _.map(inprogress, _.clone);

    _.each(inprogress, function(game) {
      if(currentTurn(game) == req.username) {
        game.turn = linksFor(game.board);
      }
    });
    
    res.send({ games: inprogress });
  });

  app.post('/new', authorize.filter, function(req, res) {
    var game = {
      id: uuid.v1(),
      player1: req.username,
      board: { }
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
