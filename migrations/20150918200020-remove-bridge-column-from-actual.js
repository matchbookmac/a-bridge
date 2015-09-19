'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn(
      'actualEvents',
      'name'
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'actualEvents',
      'name',
      {
        type: Sequelize.STRING,
        allowNull: false
      }
    );
  }
};
