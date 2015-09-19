'use strict';
var ScheduledEvent = require('../models/index').ScheduledEvent;
var Bridge = require('../models/index').bridge;

module.exports = {
  up: function (queryInterface, Sequelize) {
    Bridge.findAll().then(function (bridges) {
      bridges.forEach(function (bridge) {
        ScheduledEvent.update({ bridgeId: bridge.id }, {
          where: {
            bridge: bridge.name
          }
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    ScheduledEvent.update({ bridgeId: 123 }, {
      where: {
        bridge: {
          $not: null
        }
      }
    });
  }
};
