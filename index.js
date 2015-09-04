require('./config/logging');
var Hapi            = require('hapi');
var _               = require('lodash');
var path            = require('path');
var fs              = require('fs');
var stream          = require('stream');
var wlog            = require('winston');
// var redis           = require('redis').createClient();
var User            = require('./models/index').User;
var port            = require('./config/config').port;
var bridgeStatuses  = require('./config/config').bridges;
var https           = require('https');
var sslConfig       = require('ssl-config')('intermediate');
var options         = {
  port: port
  // tls: {
  //   key: fs.readFileSync(path.join(__dirname + '/keys/server.key')),
  //   cert: fs.readFileSync(path.join(__dirname + '/keys/server.crt')),
  //   ca: fs.readFileSync(path.join(__dirname + '/keys/cs.crt'), 'utf8'),
  //   requestCert: true,
  //   rejectUnauthorized: false
  // }
};
var plugins = [
  { register: require('inert') },
  { register: require('vision') },
  { register: require('hapi-auth-bearer-token') },
  { register: require('lout'),
    options: {
      filterRoutes: function (route) {
        return !/^\/public\/.+/.test(route.path);
      }
    }
  }
];
var server = new Hapi.Server();
server.connection(options);
var io = require('socket.io')(server.listener);
var bridgeEventSocket = io.on('connection', function (socket) {
  // disconnect users who try to send us data
  socket.conn.on('data', function (chunk) {
    socket.disconnect();
    wlog.warn("[%s] tried to send data and was disconnected",
                this.remoteAddress
    );
  });

  socket.emit('bridge data', bridgeStatuses);
  wlog.info("[%s] %s sent from %s",
                socket.handshake.address,
                "socket",
                socket.handshake.headers.referer
  );
});

var eventEmitters = {
  bridgeEventSocket:  bridgeEventSocket,
  bridgeSSE:          new stream.PassThrough()
};
eventEmitters.bridgeSSE.setMaxListeners(0);

io.on('data', function (chunk) {
});

server.register(plugins, function (err) {
  if (err) wlog.error(err);
  server.on('response', function (request) {
    wlog.info("[%s] %s %s - %s",
                  request.info.remoteAddress,
                  request.method,
                  request.url.path,
                  request.response.statusCode
    );
  });
});

server.auth.strategy('simple', 'bearer-access-token', {
  validateFunc: function (token, callback) {
    var request = this;
    var user    = User.findWithToken(token, function (user) {
      if (user) {
        callback(null, true, { user: user.email, token: token });
      } else {
        callback(null, false, { user: null, token: token });
      }
    });
  }
});

server.views({
  engines: {
    html: require('handlebars')
  },
  path: path.join(__dirname, 'public/templates')
});

server.route(require('./routes')(eventEmitters));

module .exports = (function () {
  server.start(function(){
    wlog.info('Server running at:', server.info.uri);
  });
  return server;
})();
