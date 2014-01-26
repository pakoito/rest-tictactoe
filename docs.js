var _ = require('underscore');

function heredoc(fun) {
  var s = fun.toString();
  s = s.replace('function () {/*\n', '');
  s = s.replace('*/}', '');
  s += "\n";
  return s;
}

var documentation = {
  "/encode/:username/:password": function() {/*
#/encode/:username/:password

Encodes a user name and password (base64). Just a nice helper function.

How to call using HttpIrb [`http_irb.rb`](https://github.com/amirrajan/rest-chess/blob/master/http_irb.rb):
  
    >irb
    >hi = HttpIrb.new
    >hi.set_host "localhost:3000"
    >hi.get "/encode/bobby/MyCoolPassword"

    {
      "result": [encoded string],
      "params": {
        "username": "bobby",
        "password": "MyCoolPassword"
      }
    }

How to call using curl:

    >curl -s "http://localhost:3000/encode/bobby/MyCoolPassword"

    ---
      result: [encoded string]
      params:
        username: "bobby"
        password: "MyCoolPassword"

  */}
};

function all() {
  return _.map(documentation, function(doc) {
    return heredoc(doc);
  }).join('\n\n');
}

function init(app) {
  app.get('/docs', function(req, res) {
    var docs = documentation[req.params.for];
    var body = "";

    if(!req.params.for) {
      body = all();
    } else if(docs) {
      body = heredoc(docs);
    } else {
      body = "Sad panda, no docs for this [" + req.params.for + "]. As a consolation, here are all the docs.\n\n" + all();
    }

    res.writeHead(200, {
      'Content-Length': Buffer.byteLength(body),
      'Content-Type': 'text/plain'
    });

    res.write(body);
    res.end();
  });
}

exports.init = init;
