var ActualEvent = require('../models/index').actualEvent;
var ScheduledEvent = require('../models/index').ScheduledEvent;
var Bridge      = require('../models/index').bridge;
var Promise     = require("bluebird");

Bridge.findAll().then(function (bridges) {
  bridges.forEach(function (bridge) {
    ScheduledEvent.update({ bridgeId: bridge.id }, {
      where: {
        bridge: bridge.name
      }
    });
  });
});
Bridge.findAll().then(function (bridges) {
  bridges.forEach(function (bridge) {
    ActualEvent.update({ bridgeId: bridge.id }, {
      where: {
        bridge: bridge.name
      }
    });
  });
});
Bridge.findAll().then(function (bridges) {
  bridges.forEach(function (bridge) {
    var totalUpTime = 0;
    Promise.all([
      ActualEvent.findAll({
        where: {
          bridgeId: bridge.id
        }
      }),
      ActualEvent.count({
        where: {
          bridgeId: bridge.id
        }
      })
    ]).then(function (results) {
      var events = results[0];
      var count = results[1];
      events.forEach(function (event) {
        totalUpTime = totalUpTime + (new Date(event.downTime) - new Date(event.upTime));
      });
      bridge.update({
        totalUpTime: totalUpTime,
        avgUpTime: (totalUpTime/count)
      }).then(function (success) {
        return;
      })
      .catch(function (err) {
        console.log(err);
        return;
      });
    }).catch(function (err) {
      console.log(err);
      return;
    });
  });
}).catch(function (err) {
  console.log(err);
  return;
});
// Bridge.findAll().then(function (bridges) {
//   bridges.forEach(function (bridge) {
//     var totalUpTime = 0;
//     Promise.all([
//       ActualEvent.findAll({
//         where: {
//           bridgeId: bridge.id
//         }
//       }),
//       ActualEvent.count({
//         where: {
//           bridgeId: bridge.id
//         }
//       })
//     ]).then(function (results) {
//       var events = results[0];
//       var count = results[1];
//       events.forEach(function (event) {
//         totalUpTime = totalUpTime + (new Date(event.downTime) - new Date(event.upTime));
//       });
// console.log(totalUpTime);
//       bridge.update({
//         totalUpTime: totalUpTime,
//         avgUpTime: (totalUpTime/count)
//       });
//     }).catch(function (err) {
//       console.log(err);
//       throw err;
//     });
//   });
// });
// Bridge.findOne({ where: { name: 'hawthorne' } }).then(function (bridge) {
//   bridge.getActualEvents().then(function (events) {
//     events.forEach(function (event) {
//       event.update({ downTime: new Date() });
//     });
//   });
// });
