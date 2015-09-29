var redis = require("redis");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var boom = require('boom');
var logger = require('../config/logging');
var redisStore = require('../index').redisStore;
var serverConfig = require('../config/config');

module .exports = function receiveActualEvent(request, reply) {
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
            redisStore.set(email, hashToken, function (err, res) {
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
};
