var boom = require('boom');
var bcrypt = require('bcrypt');
var crypto = require('crypto');

exports = module.exports = function (logger, redisStore) {
  function updateUserToken(request, reply) {
    var email = request.params.email;
    var newToken = request.payload.token;
    redisStore.get(email, function (err, hashToken) {
      if (err) errorUpdatingResponse(err);

      if (hashToken) {
        if (newToken) {
          storeNewHashToken(newToken);
        } else {
          crypto.randomBytes(16, function(ex, buf) {
            var token = buf.toString('hex');
            storeNewHashToken(token);
          });
        }
      } else {
        doesNotExistResponse();
      }
    });
    function storeNewHashToken(token) {
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(token, salt, function(err, hash) {
          if (err) errorUpdatingResponse(err);
          redisStore.set(email, hash, function (err, res) {
            if (err) return errorUpdatingResponse(err);
            var response = reply({ email: email, token: token });
            response.statusCode = 201;
            logger.info('User updated: '+ email);
          });
        });
      });
    }
    function doesNotExistResponse() {
      logger.warn('User: '+ email +' does not exist');
      return reply(boom.notFound('User: '+ email +' does not exist'));
    }
    function errorUpdatingResponse(err) {
      logger.error('Error updating user: '+ email +' token'+ err);
      return reply(boom.badImplementation('Error updating user: '+ email +' token'));
    }
  }
  return updateUserToken;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'redis' ];
