var strftime       = require('strftime');
var boom           = require('boom');
var util           = require('util');
var Promise        = require("bluebird");
var ActualEvent    = require('../models/index').actualEvent;
var logger         = require('../config/logging');
var bridgeStatuses = require('../config/config').bridges;
var bridgeOpenings = require('../config/config').bridgeOpenings;
var Bridge         = require('../models/index').bridge;
var postBridgeMessage  = require('../modules/post-bridge-message');
var handlePostResponse = require('../modules/handle-post-response');

module .exports = function receiveActualEvent(request, reply) {
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
    // Assemble current status for bridge
    bridge = bridge[0];
    previousScheduledLift = bridgeStatuses[bridge.name] ? bridgeStatuses[bridge.name].scheduledLift : null;
    bridgeStatuses[bridge.name] = {
      status: event.status,
      scheduledLift: event.status ? null : previousScheduledLift
    };
    bridgeStatuses.changed.bridge = bridge.name;
    bridgeStatuses.changed.item = "status";
    logger.info("%s %s at %s",
      bridge.name,
      bridgeStatuses[bridge.name].status ? 'up' : 'down',
      event.timeStamp.toString()
    );
    var timeStamp  = strftime("%Y/%m/%d %H:%M:%S", event.timeStamp);
    if (event.status){
      reply("event up post received");
      var actualEvent = {
        name: bridge.name,
        uptime: timeStamp
      };
      //check to see if there are any unclosed bridge openings, if so then delete them and replace with this new bridge opening
      for (i = 0; i < bridgeOpenings.length; i++){
        if(bridgeOpenings[i].name === bridge.name){
          bridgeOpenings.splice(i, 1);
        }
      }
      bridgeOpenings.push(actualEvent);
    } else {
      if (bridgeOpenings.length === 0) successResponse();
      for (i = 0; i < bridgeOpenings.length; i++){
        //check to see if there are any open bridge events that correspond with this close event
        if (bridgeOpenings[i].name === bridge.name){
          Promise.all([
            ActualEvent.create({
              bridgeId: bridge.id,
              upTime: bridgeOpenings[i].uptime,
              downTime: timeStamp
            }),
            ActualEvent.count({
              where: {
                bridgeId: bridge.id
              }
            })
          ]).then(updateBridge)
            .catch(errorResponse);
          bridgeOpenings.splice(i, 1);
        } else {
          successResponse();
        }
      }
    }
    function updateBridge(results) {
      var event = results[0];
      var count = results[1] + 1;
      var newTotalUpTime = bridge.totalUpTime + (new Date(event.downTime) - new Date(event.upTime));
      bridge.update({
        totalUpTime: newTotalUpTime,
        avgUpTime: (newTotalUpTime/count),
        actualCount: count
      }).then(successResponse)
        .catch(errorResponse);
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
  }).catch(errorResponse);
  function successResponse(event) {
    reply("event down post received");
  }
  function errorResponse(err) {
    reply(boom.badRequest("There was an error with your event post: " + err));
  }
};
