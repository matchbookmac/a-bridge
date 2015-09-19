'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('actualEvents', 'down_time', 'downTime');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('actualEvents', 'downTime', 'down_time');
  }
};
