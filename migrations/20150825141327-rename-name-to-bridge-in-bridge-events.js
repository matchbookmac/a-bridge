'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('bridgeEvents', 'actualEvents');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('actualEvents', 'bridgeEvents');
  }
};
