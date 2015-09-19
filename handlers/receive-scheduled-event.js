var boom           = require('boom');
var util           = require('util');
var ScheduledEvent = require('../models/index').scheduledEvent;
var db             = require('../models/index');
var logger         = require('../config/logging');
var bridgeStatuses = require('../config/config').bridges;
var Bridge         = require('../models/index').bridge;
var postBridgeMessage  = require('../modules/post-bridge-message');
var handlePostResponse = require('../modules/handle-post-response');

module .exports = function receiveScheduledEvent(request, reply) {
  var event = request.payload;
  var bridge = event.bridge.replace(/\'/g, "");
  Bridge.findOrCreate({
    where: {
      name: bridge,
      totalUpTime: {
        $gte: 0
      },
      avgUpTime: {
        $gte: 0
      }
    }
  }).then(function (bridge) {
    bridge = bridge[0];
    // Assemble current status for bridge
    currentStatus = bridgeStatuses[bridge.name] ? bridgeStatuses[bridge.name].status : false;
    bridgeStatuses[bridge.name] = {
      status: currentStatus,
      scheduledLift: event
    };
    event.bridgeId = bridge.id;
    bridgeStatuses.changed.bridge = bridge.name;
    bridgeStatuses.changed.item = "scheduledLift";
    logger.info("%s %s lift scheduled for %s at %s",
      bridge.name,
      bridgeStatuses[bridge.name].scheduledLift.type,
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
    postBridgeMessage(bridgeStatuses, null, function (err, res, status) {
      handlePostResponse(status, bridgeStatuses, function (err, status) {
        if (err) logger.error("Error posting\n" + util.inspect(bridgeStatuses) + ":\n" + util.inspect(err) + "\n Status: " + status);
      });
    });
  }).catch(function (err) {
    reply(boom.badRequest("There was an error with your schedule post: " + err));
  });
};
