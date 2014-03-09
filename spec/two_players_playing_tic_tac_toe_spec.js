var games = require('../controllers/games');
var _ = require('underscore');

var req = { send: function() { } };

describe('two players playing tic tac toe', function() {
  it('works', function() {
    var game = games.newGame({ username: "player1" }, req);

    games.join({
      params: { id: game.id },
      username: "player2"
    }, req);

    console.log(games.games());
  });
});
