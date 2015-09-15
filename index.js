require('./config/logging');
var Hapi            = require('hapi');
var _               = require('lodash');
var path            = require('path');
var fs              = require('fs');
var wlog            = require('winston');
var User            = require('./models/index').User;
var serverConfig    = require('./config/config');
var sslConfig       = require('ssl-config')('intermediate');
var options         = { port: serverConfig.port };

var plugins = [
  { register: require('inert') },
  { register: require('vision') },
  { register: require('hapi-auth-bearer-token') },
  { register: require('lout') }
];

var server = new Hapi.Server();
server.connection(options);

server.register(plugins, function (err) {
  if (err) wlog.error(err);
  server.on('response', function (request) {
    wlog.info("[%s] incoming %s %s - %s",
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

server.route(require('./routes'));

module .exports = (function () {
  server.start(function(){
    wlog.info('Server running at:', server.info.uri);
  });
  return server;
})();
