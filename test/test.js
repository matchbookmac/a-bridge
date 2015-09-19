var Bridge = require('../models/index').bridge;

Bridge.findOne({ where: { name: 'hawthorne' } }).then(function (bridge) {
  bridge.getScheduledEvents().then(function (events) {
    console.log(events);
  });
});
