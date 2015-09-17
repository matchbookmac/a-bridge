var db = require('../models/index');
var User = db.user;
var Bridge = db.bridge;

db.sequelize.sync({force: true}).then(function () {
  User.create({ email: 'user@example.com', token: '1234' }).then(function () {
    return;
  });
  Bridge.create({ name: 'Hawthorne', totalUpTime: 0.0, avgUpTime: 0.0 });
  Bridge.create({ name: 'Morrison', totalUpTime: 0.0, avgUpTime: 0.0 });
  Bridge.create({ name: 'Burnside', totalUpTime: 0.0, avgUpTime: 0.0 });
  Bridge.create({ name: 'Broadway', totalUpTime: 0.0, avgUpTime: 0.0 });
}).catch(function (err) {
  console.log('There was an error seeding: ' + err);
});
