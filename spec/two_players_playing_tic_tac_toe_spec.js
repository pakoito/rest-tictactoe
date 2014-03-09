var games = require('../controllers/games');
var _ = require('underscore');

var res = { send: function() { } };

describe('two players playing tic tac toe', function() {
  it('works', function() {
    var game = games.newGame({ username: "player1" }, res);

    games.join({
      params: { id: game.id },
      username: "player2"
    }, res);

    games.move({
      params: {
        id: game.id,
        topleft: 'x'
      }
    }, res);

    games.move({
      params: {
        id: game.id,
        topmiddle: 'o'
      }
    }, res);

    games.move({
      params: {
        id: game.id,
        topright: 'x'
      }
    }, res);

    expect(game.board.topright).toEqual('x');
  });
});
