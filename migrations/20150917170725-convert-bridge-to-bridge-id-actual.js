'use strict';
var ActualEvent = require('../models/index').actualEvent;
var Bridge = require('../models/index').bridge;

module.exports = {
  up: function (queryInterface, Sequelize) {
    Bridge.findAll().then(function (bridges) {
      bridges.forEach(function (bridge) {
        ActualEvent.update({ bridgeId: bridge.id }, {
          where: {
            bridge: bridge.name
          }
        });
      });
    });
  },

  down: function (queryInterface, Sequelize) {
    ActualEvent.update({ bridgeId: 123 }, {
      where: {
        bridge: {
          $not: null
        }
      }
    });
  }
};
