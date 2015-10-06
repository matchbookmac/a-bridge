var boom = require('boom');
var async = require('async');

exports = module.exports = function (logger, redisStore) {
  function updateUserEmail(request, reply) {
    var newEmail = request.payload.email;
    var oldEmail = request.params.email;
    redisStore.get(oldEmail, function (err, hashToken) {
      if (err) errorUpdatingResponse(err);

      if (hashToken) {
        if (newEmail !== oldEmail) {
          async.parallel([
            function (callback) {
              redisStore.set(newEmail, hashToken, callback);
            },
            function (callback) {
              redisStore.sadd('users', newEmail, callback);
            },
            function (callback) {
              redisStore.srem('users', oldEmail, callback);
            },
            function (callback) {
              redisStore.del(oldEmail, callback);
            }
          ], function (err, results) {
            if (err) return errorUpdatingResponse(err);
            logger.info('User: '+oldEmail+' updated to: '+ newEmail);
            reply('User: '+oldEmail+' updated to: '+ newEmail);
          });
        } else {
          noNewEmailResponse();
        }
      } else {
        doesNotExistResponse();
      }
    });
    function noNewEmailResponse() {
      logger.warn('New e-mail is the same as: '+ oldEmail);
      return reply(boom.badRequest('New e-mail is the same as: '+ oldEmail));
    }
    function doesNotExistResponse() {
      logger.warn('User: '+ oldEmail +' does not exist');
      return reply(boom.notFound('User: '+ oldEmail +' does not exist'));
    }
    function errorUpdatingResponse(err) {
      logger.error('Error updating user: '+ oldEmail +' email'+ err);
      return reply(boom.badImplementation('Error updating user: '+ oldEmail +' email'));
    }
  }
  return updateUserEmail;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'redis' ];
