var db = require('../models/index');
var User = db.user;
var Bridge = db.bridge;

// db.sequelize.sync({force: true}).then(function () {
  User.create({ email: 'user@example.com', token: '1234' }).then(function () {
    return;
  });
  Bridge.create({ name: 'hawthorne', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    return;
  });
  Bridge.create({ name: 'morrison', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    return;
  });
  Bridge.create({ name: 'burnside', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    return;
  });
  Bridge.create({ name: 'broadway', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    return;
  });
  Bridge.create({ name: 'cuevas crossing', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    return;
  });
  Bridge.create({ name: 'baileys bridge', totalUpTime: 0.0, avgUpTime: 0.0, actualCount: 0, scheduledCount: 0 }).then(function () {
    return;
  });
// }).catch(function (err) {
//   console.log('There was an error seeding: ' + err);
// });
