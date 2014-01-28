var _ = require('underscore');

function toString(board) {
  var stringBoard = [];

  _.each(board, function(row) {
    stringBoard.push(row.join(""));
  });

  return stringBoard;
}

function init(app) {
  app.get('/tictactoe', function(req, res) {
    var board = [
      [".", ".", "."],
      [".", ".", "."],
      [".", ".", "."],
    ];

    if(req.params.topLeft) {
      board[0][0] = "x";
    }

    res.send({
      board: toString(board),
      moves: {
        topleft: "/tictactoe?topLeft=x"
      }
    });
  });
}

exports.init = init;
