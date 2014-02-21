var _ = require('underscore');
var querystring = require('querystring');
var availableMoves = {
  topleft: { row: 0, col: 0 },
  topmiddle: { row: 0, col: 1 }
};

function toString(board) {
  var stringBoard = [
    [".", ".", "."],
    [".", ".", "."],
    [".", ".", "."],
  ];

  _.each(board, function(entry, key) {
    var loc = availableMoves[key];
    stringBoard[loc.row][loc.col] = entry;
  });

  return _.map(stringBoard, function(row) {
    return row.join("");
  });
}

function turn(board) {
  var counts = _.chain(board)
    .countBy(function(entry) {
      return entry == 'x' ? 'x' : 'o';
    })
    .defaults({ x: 0, o: 0 })
    .value();

  //return counts.x == counts.o ? 'x' : 'o';

  if(counts.x == counts.o) return "x";

  return "o";
}

function variations(board) {
  return _.chain(availableMoves)
    .keys()
    .reject(function(key) { return board[key]; })
    .map(function(key) {
      var nextMove = _.clone(board);
      nextMove[key] = turn(board);
      return [key, nextMove];
    })
    .object()
    .value();

  return moves;
}

function linksFor(board) {
  //return _.reduce(_.pairs(variations(board)), function(links, pair) {
  //  links[pair[0]] = "/tictactoe?" + querystring.stringify(pair[1]);
  //  return links;
  //  }, {});

  //return _.chain(variations(board))
  //  .pairs()
  //  .reduce(function(links, pair) {
  //    links[pair[0]] = "/tictactoe?" + querystring.stringify(pair[1]);
  //    return links;
  //  }, {})
  //  .value();

  return _.chain(variations(board))
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
