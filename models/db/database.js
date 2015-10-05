'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var _         = require('lodash');

exports = module.exports = function (config, logger) {

  var basename  = path.basename(module.filename);
  var env       = config.env || 'development';
  var dbConfig  = config.database;
  if (env === 'development') dbConfig.logging = logger.debug;
  var sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);
  var db        = {};
  fs.readdirSync(path.resolve(__dirname, '..'))
    .filter(function(file) {
      return (file.indexOf('.') !== 0) && (file !== basename);
    })
    .forEach(function(file) {
      if (file.slice(-3) !== '.js') return;
      var model = sequelize['import'](path.join(path.resolve(__dirname, '..'), file));
      db[model.name] = model;
    });

  Object.keys(db).forEach(function(modelName) {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  var Bridge = db.bridge;
  var ActualEvent = db.actualEvent;
  var ScheduledEvent = db.scheduledEvent;
  Bridge.hasMany(ActualEvent);
  Bridge.hasMany(ScheduledEvent);

  // Populate lastFive for each bridge on startup b/c there's not a better place to do this right now
  var bridgeStatuses = config.bridges;
  _.forOwn(bridgeStatuses, function (status, bridgeName) {
    if (bridgeName !== 'changed') {
      Bridge.findOne({
        where: {
          name: bridgeName
        }
      }).then(function (bridge) {
        ActualEvent.findAll({
          order: 'upTime DESC',
          where: {
            bridgeId: bridge.id
          },
          limit: 5
        }).then(function (rows) {
            bridgeStatuses[bridgeName].lastFive = rows;
          })
          .catch(function (err) {
            bridgeStatuses[bridgeName].lastFive = null;
          });
      }).catch(function (err) {
        bridgeStatuses[bridgeName].lastFive = null;
      });
    }
  });

  return db;
};

exports['@singleton'] = true;
exports['@require'] = [ 'config', 'logger' ];
