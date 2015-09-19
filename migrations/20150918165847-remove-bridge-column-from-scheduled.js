'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'scheduledEvents',
      'bridge'
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'scheduledEvents',
      'bridge',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  }
};
