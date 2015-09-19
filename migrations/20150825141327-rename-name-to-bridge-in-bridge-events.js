'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('actualEvents', 'name', 'bridge');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('actualEvents', 'bridge', 'name');
  }
};
