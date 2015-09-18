'use strict';
var ActualEvent = require('../models/index').actualEvent;
var Bridge = require('../models/index').bridge;

module.exports = {
  up: function (queryInterface, Sequelize) {
    Bridge.findAll().then(function (bridges) {
      bridges.forEach(function (bridge) {
        ActualEvent.update(bridge.id, {
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
    ActualEvent.update(null, {
      where: {
        bridge: {
          $not: null
        }
      }
    });
  }
};
