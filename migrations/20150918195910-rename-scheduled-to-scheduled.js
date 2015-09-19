'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('ScheduledEvents', 'scheduledEvents');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('scheduledEvents', 'ScheduledEvents');
  }
};
