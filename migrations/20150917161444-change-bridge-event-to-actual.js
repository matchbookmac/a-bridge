'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('bridgeEvents', 'name', 'bridge');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('bridgeEvents', 'bridge', 'name');
  }
};
