var crypto = require('crypto');
var bcrypt = require('bcrypt');
var injector = require('electrolyte');
var async = require('async');

exports = module.exports = function (logger, config, redisStore, db) {
  function mysql() {
    var Bridge = db.bridge;
    Bridge.findOrCreate({ where:
      {
        name: 'hawthorne',
        totalUpTime: { $gte: 0 },
        avgUpTime: { $gte: 0 },
        actualCount: { $gte: 0 },
        scheduledCount: { $gte: 0 }
      }
    }).then(function () {
      return;
    });
    Bridge.findOrCreate({ where:
      {
        name: 'morrison',
        totalUpTime: { $gte: 0 },
        avgUpTime: { $gte: 0 },
        actualCount: { $gte: 0 },
        scheduledCount: { $gte: 0 }
      }
    }).then(function () {
      return;
    });
    Bridge.findOrCreate({ where:
      {
        name: 'burnside',
        totalUpTime: { $gte: 0 },
        avgUpTime: { $gte: 0 },
        actualCount: { $gte: 0 },
        scheduledCount: { $gte: 0 }
      }
    }).then(function () {
      return;
    });
    Bridge.findOrCreate({ where:
      {
        name: 'broadway',
        totalUpTime: { $gte: 0 },
        avgUpTime: { $gte: 0 },
        actualCount: { $gte: 0 },
        scheduledCount: { $gte: 0 }
      }
    }).then(function () {
      return;
    });
    // Bridge.create({ name: 'cuevas crossing', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    // return;
    // });
    // Bridge.create({ name: 'baileys bridge', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    // return;
    // });

  }

  function redis() {
    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash('1234', salt, function(err, hash) {
        if (err) return logger.info(err);
        hashToken = hash;
        logger.info(hashToken);
        async.parallel([
          function (callback) {
            redisStore.set('user@example.com', hashToken, callback);
          },
          function (callback) {
            redisStore.sadd('users', 'user@example.com', callback);
          }
        ], function (err, res) {
          if (err) return logger.info(err);
          logger.info(res);
          logger.info('user@example.com with token 1234 has been set');
          redisStore.quit();
        });
      });
    });
  }

  return {
    mysql: mysql,
    redis: redis
  };
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'config', 'redis', 'database' ];
