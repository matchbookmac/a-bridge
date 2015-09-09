var strftime       = require('strftime');
var boom           = require('boom');
var BridgeEvent    = require('../models/index').BridgeEvent;
var wlog           = require('winston');
var bridgeStatuses = require('../config/config').bridges;
var bridgeOpenings = require('../config/config').bridgeOpenings;

module .exports = function receiveBridgeEvent(request, reply) {
  var event = request.payload;
  var bridge = event.bridge.replace(/\'/g, "");
  // Assemble current status for bridge
  previousScheduledLift = bridgeStatuses[bridge] ? bridgeStatuses[bridge].scheduledLift : null;
  bridgeStatuses[bridge] = {
    status: event.status,
    scheduledLift: event.status ? null : previousScheduledLift
  };
  wlog.info("%s %s at %s",
    bridge,
    bridgeStatuses[bridge].status ? 'up' : 'down',
    event.timeStamp.toString()
  );

  var timeStamp  = strftime("%Y/%m/%d %H:%M:%S", event.timeStamp);
  if (event.status){
    reply("event up post received");
    var bridgeEvent = {
      name: bridge,
      uptime: timeStamp
    };
    //check to see if there are any unclosed bridge openings, if so then delete them and replace with this new bridge opening
    for (i = 0; i < bridgeOpenings.length; i++){
      if(bridgeOpenings[i].name === bridge){
        bridgeOpenings.splice(i, 1);
      }
    }
    bridgeOpenings.push(bridgeEvent);
  } else {
    for (i = 0; i < bridgeOpenings.length; i++){
      //check to see if there are any open bridge events that correspond with this close event
      if (bridgeOpenings[i].name === bridge){
        BridgeEvent.create({ bridge: bridge, up_time: bridgeOpenings[i].uptime, down_time: timeStamp })
                    .then(successResponse)
                    .catch(errorResponse);
        bridgeOpenings.splice(i, 1);
      }
    }
  }
  
  function successResponse(event) {
    reply("event down post received");
  }

  function errorResponse(err) {
    reply(boom.badRequest("There was an error with your event post: " + err));
  }
};
