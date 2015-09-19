'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'actualEvents',
      'bridge'
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'actualEvents',
      'bridge',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  }
};
