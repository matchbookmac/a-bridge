var bcrypt = require('bcrypt');

exports = module.exports = function (logger, redisStore) {
  function addResponseLogging(server) {
    server.auth.strategy('simple', 'bearer-access-token', {
      allowMultipleHeaders: true,
      validateFunc: function (token, callback) {
        var credentials = token.split(':');
        var email = credentials[0];
        var secret = credentials[1];
        // Find user by email
        redisStore.get(email, function (err, hashToken) {
          if (err) errorResponse(err);
          // Compare the stored hash with the token provided
          if (hashToken) {
            bcrypt.compare(secret, hashToken, function(err, res) {
              if (err) logger.error(err);
              if (res) {
                logger.info('User: '+ email +' has authenticated');
                return callback(null, true, { user: email, token: secret });
              } else {
                logger.warn('User: '+ email +' failed authentication');
                return callback(null, false, { user: email, token: secret });
              }
            });
          } else {
            logger.warn('User: '+ email +' does not exist');
            return callback(null, false, { user: email, token: secret });
          }
        });
      }
    });
  }

  return addResponseLogging;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'redis' ];
