'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('Users', 'users');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameTable('users', 'Users');
  }
};
