var boom = require('boom');
var async = require('async');

exports = module.exports = function (logger, redisStore) {
  function deleteUser(request, reply) {
    var email = request.params.email;
    redisStore.get(email, function (err, hashToken) {
      if (err) errorUpdatingResponse(err);

      if (hashToken) {
        async.parallel([
          function (callback) {
            redisStore.srem('users', email, callback);
          },
          function (callback) {
            redisStore.del(email, callback);
          }
        ], function (err, results) {
          if (err) return errorDeletingResponse(err);
          logger.info('User: '+email+' deleted');
          reply('User: '+email+' deleted');
        });
      } else {
        doesNotExistResponse();
      }
    });
    function doesNotExistResponse() {
      logger.warn('User: '+ email +' does not exist');
      return reply(boom.notFound('User: '+ email +' does not exist'));
    }
    function errorDeletingResponse(err) {
      logger.error('Error deleting user: '+ email +' '+ err);
      return reply(boom.badImplementation('Error deleting user: '+ email));
    }
  }
  return deleteUser;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'redis' ];
