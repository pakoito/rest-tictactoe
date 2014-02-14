function init(app) {
  app.get('/', function (req, res) {
    var urls = {
      alldocumentation: {
        method: 'get',
        notes: 'only returns text/plain',
        url: '/docs',
      },
      documentation: {
        method: 'get',
        notes: 'only returns text/plain',
        url: '/docs?for=:url',
        example: '/docs?for=/encode/:username/:password'
      },
      register: {
        method: 'post',
        url: '/register'
      },
      encode: {
        method: 'get',
        url: '/encode/:username/:password'
      }
    };

    if(req.isAuthenticated) {
      urls.newgame = {
        method: 'post',
        url: '/new'
      };

      urls.opengames = {
        method: 'get',
        url: '/opengames'
      };

      urls.engine = {
        method: 'get',
        url: '/tictactoe'
      };

      urls.inprogress = {
        method: 'get',
        url: '/inprogress'
      };
    }

    res.send(urls);
  });
}

exports.init = init;
