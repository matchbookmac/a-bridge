'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('bridgeEvents', 'actualEvents');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('actualEvents', 'bridgeEvents');
  }
};
