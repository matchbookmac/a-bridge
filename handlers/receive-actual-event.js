var strftime       = require('strftime');
var boom           = require('boom');
var util           = require('util');
var ActualEvent    = require('../models/index').actualEvent;
var logger         = require('../config/logging');
var bridgeStatuses = require('../config/config').bridges;
var bridgeOpenings = require('../config/config').bridgeOpenings;
var postBridgeMessage  = require('../modules/post-bridge-message');
var handlePostResponse = require('../modules/handle-post-response');

module .exports = function receiveActualEvent(request, reply) {
  var event = request.payload;
  var bridge = event.bridge.replace(/\'/g, "");
  // Assemble current status for bridge
  previousScheduledLift = bridgeStatuses[bridge] ? bridgeStatuses[bridge].scheduledLift : null;
  bridgeStatuses[bridge] = {
    status: event.status,
    scheduledLift: event.status ? null : previousScheduledLift
  };
  bridgeStatuses.changed.bridge = bridge;
  bridgeStatuses.changed.item = "status";
  logger.info("%s %s at %s",
    bridge,
    bridgeStatuses[bridge].status ? 'up' : 'down',
    event.timeStamp.toString()
  );
  var timeStamp  = strftime("%Y/%m/%d %H:%M:%S", event.timeStamp);
  if (event.status){
    reply("event up post received");
    var actualEvent = {
      name: bridge,
      uptime: timeStamp
    };
    //check to see if there are any unclosed bridge openings, if so then delete them and replace with this new bridge opening
    for (i = 0; i < bridgeOpenings.length; i++){
      if(bridgeOpenings[i].name === bridge){
        bridgeOpenings.splice(i, 1);
      }
    }
    bridgeOpenings.push(actualEvent);
  } else {
    for (i = 0; i < bridgeOpenings.length; i++){
      //check to see if there are any open bridge events that correspond with this close event
      if (bridgeOpenings[i].name === bridge){
        ActualEvent.create({ bridge: bridge, up_time: bridgeOpenings[i].uptime, down_time: timeStamp })
                    .then(successResponse)
                    .catch(errorResponse);
        bridgeOpenings.splice(i, 1);
      }
    }
  }
  postBridgeMessage(bridgeStatuses, null, function (err, res, status) {
    handlePostResponse(status, bridgeStatuses, function (err, status) {
      if (err) {
        logger.error("Error posting\n%s\n%s\nStatus: %s",
          util.inspect(bridgeStatuses),
          util.inspect(err),
          status
        );
      }
    });
  });

  function successResponse(event) {
    reply("event down post received");
  }

  function errorResponse(err) {
    reply(boom.badRequest("There was an error with your event post: " + err));
  }
};
