var _ = require('underscore');
var querystring = require('querystring');

function toString(board) {
  var stringBoard = [];

  _.each(board, function(row) {
    stringBoard.push(row.join(""));
  });

  return stringBoard;
}

function turn(board) {
  var x = 0;
  var o = 0;

  _.each(_.flatten(board), function(entry) {
    if(entry == "x") x += 1;
    if(entry == "o") o += 1;
  });

  if(x == o) return "x";

  return 'o';
}

function init(app) {
  app.get('/tictactoe', function(req, res) {
    var board = [
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ];

    var availableMoves = {
      topleft: { row: 0, col: 0 },
      topmiddle: { row: 0, col: 1 }
    };

    for(var key in availableMoves) {
      var move = availableMoves[key];
      if(req.params[key]) {
        board[move.row][move.col] = req.params[key];
      }
    }

    var moves = { };

    for(var key in availableMoves) {
      var nextMove = JSON.parse(JSON.stringify(req.params));
      nextMove[key] = turn(board);
      if(!req.params[key]) {
        moves[key] = "/tictactoe?" + querystring.stringify(nextMove);
      }
    };

    res.send({
      board: toString(board),
      moves: moves
    });
  });
}

exports.init = init;
