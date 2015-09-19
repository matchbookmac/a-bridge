'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('actualEvents', 'up_time', 'upTime');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('actualEvents', 'upTime', 'up_time');
  }
};
