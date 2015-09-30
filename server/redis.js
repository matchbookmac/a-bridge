var redis = require("redis");

exports = module.exports = function (logger, serverConfig) {
  var redisStore = redis.createClient(serverConfig.redis.port, serverConfig.redis.host);

  logger.info('Connected to Redis at: '+ redisStore.address);

  return redisStore;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'config' ];
