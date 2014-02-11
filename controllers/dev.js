function init(app) {
  app.post('/reset', function(req, res) {
    games.reset();
    authentication.reset();
    res.send({ });
  });
}

exports.init = init;
