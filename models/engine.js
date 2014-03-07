var _ = require('underscore');
var availableMoves = {
  topleft: { row: 0, col: 0 },
  topmiddle: { row: 0, col: 1 }
};

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

module.exports.variations = variations;
module.exports.turn = turn;
module.exports.availableMoves = availableMoves;
