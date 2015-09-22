var Hapi            = require('hapi');
var _               = require('lodash');
var path            = require('path');
var fs              = require('fs');
var logger          = require('./config/logging');
var User            = require('./models/index').user;
var serverConfig    = require('./config/config');
var sslConfig       = require('ssl-config')('intermediate');
var options         = { port: serverConfig.port };

var plugins = [
  { register: require('inert') },
  { register: require('vision') },
  { register: require('hapi-auth-bearer-token') },
  { register: require('lout') }
];

// Setup new Hapi server
var server = new Hapi.Server();
server.connection(options);

// Redis for auth
var redis = require("redis");
var redisStore = redis.createClient();
redisStore.auth(serverConfig.redis.password, function (err, res) {
  if (err) return logger.error('Problem connecting to redis: '+ err);
  logger.info('Connected to Redis at: '+ redisStore.address);
});

server.register(plugins, function (err) {
  if (err) logger.error(err);
});

server.on('response', function (request) {
  logger.info("[%s] incoming %s %s - %s",
    request.headers['x-forwarded-for'] || request.info.remoteAddress,
    request.method,
    request.url.path,
    request.response.statusCode
  );
});

server.auth.strategy('simple', 'bearer-access-token', {
  validateFunc: function (token, callback) {
    var request = this;
    // var user    = User.findWithToken(token, function (user) {
    // });
    redisStore.get(token, function (err, user) {
      if (err) {
        logger.error(err);
        return callback(null, false, { user: null, token: token });
      }
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
    logger.info('Server running at:', server.info.uri);
  });
  return server;
})();
