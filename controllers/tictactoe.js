var _ = require('underscore');
var querystring = require('querystring');
var engine = require('../models/engine');

function toString(board) {
  var stringBoard = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

  _.each(board, function(entry, key) {
    var loc = engine.availableMoves[key];
    stringBoard[loc.row][loc.col] = entry;
  });

  return _.map(stringBoard, function(row) {
    return row.join("");
  });
}

function linksFor(board) {
  //return _.reduce(_.pairs(engine.variations(board)), function(links, pair) {
  //  links[pair[0]] = "/tictactoe?" + querystring.stringify(pair[1]);
  //  return links;
  //  }, {});

  //return _.chain(engine.variations(board))
  //  .pairs()
  //  .reduce(function(links, pair) {
  //    links[pair[0]] = "/tictactoe?" + querystring.stringify(pair[1]);
  //    return links;
  //  }, {})
  //  .value();

  return _.chain(engine.variations(board))
    .map(function(entry, key) {
      return [key, { method: "get", url: "/tictactoe?" + querystring.stringify(entry) }];
    })
    .object()
    .value();
}

function init(app) {
  app.get('/tictactoe', function(req, res) {
    res.send({
      board: toString(req.params),
      moves: linksFor(req.params)
    });
  });
}

exports.init = init;
