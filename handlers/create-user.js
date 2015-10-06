var crypto = require('crypto');
var bcrypt = require('bcrypt');
var boom = require('boom');
var async = require('async');

exports = module.exports = function (logger, serverConfig, redisStore) {
  function createUser(request, reply) {
    var email = request.payload.email;
    redisStore.get(email, function (err, hashToken) {
      if (err) errorResponse(err);
      if (hashToken) {
        return reply(boom.conflict('User: '+email+' already exists'));
      } else {
        crypto.randomBytes(16, function(ex, buf) {
          var token = buf.toString('hex');
          var hashToken;
          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(token, salt, function(err, hash) {
              if (err) errorResponse(err);
              hashToken = hash;
              async.parallel([
                function (callback) {
                  redisStore.set(email, hashToken, callback);
                },
                function (callback) {
                  redisStore.sadd('users', email, callback);
                }
              ], function (err, res) {
                if (err) errorResponse(err);
                if (res) {
                  var response = reply({ email: email, token: token });
                  response.statusCode = 201;
                  logger.info('User created: '+ email);
                } else {
                  errorResponse('Something went wrong creating a user');
                }
              });
            });
          });
        });
      }
    });
    function errorResponse(err) {
      reply(boom.badImplementation(err));
      return logger.error(err);
    }
  }
  return createUser;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'config', 'redis' ];
