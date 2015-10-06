var boom = require('boom');

exports = module.exports = function (logger, redisStore) {
  function getUsers(request, reply) {
    redisStore.smembers('users', function (err, users) {
      if (err) errorResponse(err);
      logger.info(users);
      return reply(users+"\n");
    });
    function errorResponse(err) {
      reply(boom.badImplementation(err));
      return logger.error(err);
    }
  }
  return getUsers;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'redis' ];
