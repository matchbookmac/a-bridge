'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('BridgeEvents', 'actualEvents');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('actualEvents', 'BridgeEvents');
  }
};
