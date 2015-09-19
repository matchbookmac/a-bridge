'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'scheduledEvents',
      'bridgeId',
      {
        type: Sequelize.INTEGER,
        allowNull: false
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('scheduledEvents', 'bridgeId');
  }
};
