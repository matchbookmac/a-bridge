'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'ScheduledEvents',
      'bridge'
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'ScheduledEvents',
      'bridge',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  }
};
