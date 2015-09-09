var boom           = require('boom');
var ScheduledEvent = require('../models/index').ScheduledEvent;
var db = require('../models/index');
var wlog           = require('winston');
var bridgeStatuses = require('../config/config').bridges;

module .exports = function receiveScheduledEvent(request, reply) {
  var event = request.payload;
  var bridge = event.bridge.replace(/\'/g, "");
  // Assemble current status for bridge
  currentStatus = bridgeStatuses[bridge] ? bridgeStatuses[bridge].status : false;
  bridgeStatuses[bridge] = {
    status: currentStatus,
    scheduledLift: event
  };
  wlog.info("%s %s lift scheduled for %s at %s",
    bridge,
    bridgeStatuses[bridge].scheduledLift.type,
    event.estimatedLiftTime.toString(),
    event.requestTime.toString()
  );
  ScheduledEvent.create(event)
                .then(function (event) {
                  reply("schedule post received");
                })
                .catch(function (err) {
                  reply(boom.badRequest("There was an error with your schedule post: " + err));
                });

};
