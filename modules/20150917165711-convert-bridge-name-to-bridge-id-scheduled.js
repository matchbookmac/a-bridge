'use strict';
var ScheduledEvent = require('../models/index').scheduledEvent;
var Bridge = require('../models/index').bridge;

module.exports = {
  up: function (queryInterface, Sequelize) {
    Bridge.findAll().then(function (bridges) {
      bridges.forEach(function (bridge) {
        ScheduledEvent.update(bridge.id, {
          where: {
            bridge: {
              $like: "%"+bridge.name+"%"
            }
          }
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    ScheduledEvent.update(null, {
      where: {
        bridge: {
          $not: null
        }
      }
    });
  }
};
