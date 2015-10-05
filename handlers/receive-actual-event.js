var boom           = require('boom');
var util           = require('util');
var Promise        = require("bluebird");

exports = module.exports = function (logger, serverConfig, db, postBridgeMessage, handlePostResponse) {
  var ActualEvent    = db.actualEvent;
  var Bridge         = db.bridge;
  var bridgeStatuses = serverConfig.bridges;
  var bridgeOpenings = serverConfig.bridgeOpenings;

  function receiveActualEvent(request, reply) {
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

      // If this is an 'up' event
      if (event.status){
        reply("event up post received");
        findLastFive();
        var actualEvent = {
          name: bridge.name,
          upTime: event.timeStamp,
          // Set delay to overlook false openings
          timer: setTimeout(postAfterDelay, 60500)
        };
        //check to see if there are any unclosed bridge openings, if so then delete them and replace with this new bridge opening
        for (i = 0; i < bridgeOpenings.length; i++){
          if(bridgeOpenings[i].name === bridge.name){
            bridgeOpenings.splice(i, 1);
          }
        }
        // Keep track of which bridges are open
        bridgeOpenings.push(actualEvent);
      // If this is an 'down' event
      } else {
        // If this is a stray 'down' event, do nothing
        if (bridgeOpenings.length === 0) {
          successResponse();
        } else {
          var found = false;
          //check to see if there are any open bridge events that correspond with this close event
          for (i = 0; i < bridgeOpenings.length; i++){
            if (bridgeOpenings[i].name === bridge.name) {
              found = true;
              // clear delay of 60s to overlook false openings
              if (event.timeStamp - bridgeOpenings[i].upTime < 60 * 1000) {
                clearTimeout(bridgeOpenings[i].timer);
                successResponse();
              } else {
                // If this is not a false alarm, add event to db, and update bridge data
                Promise.all([
                  ActualEvent.create({
                    bridgeId: bridge.id,
                    upTime: bridgeOpenings[i].upTime,
                    downTime: event.timeStamp
                  }),
                  ActualEvent.count({
                    where: {
                      bridgeId: bridge.id
                    }
                  })
                ]).then(updateBridge)
                  .catch(errorResponse);
                // Relay the 'down' event to i-bridge
                findLastFive(postAfterDelay);
              }
              bridgeOpenings.splice(i, 1);
            }
          }
          if (!found) successResponse();
        }
      }
      function findLastFive(next) {
        // Find last five events
        ActualEvent.findAll({
          order: 'upTime DESC',
          where: {
            bridgeId: bridge.id
          },
          limit: 5
        }).then(function (rows) {
            logger.info("rows: " + rows);
            bridgeStatuses[bridge.name].lastFive = rows;
            if (next) next();
          })
          .catch(function (err) {
            logger.error(err);
            logger.error('Could not find events for bridge:', bridgeStatuses.changed.bridge);
            bridgeStatuses[bridge.name].lastFive = null;
            if (next) next();
          });
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
      function postAfterDelay() {
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
      }
    }).catch(function (err) {
      errorResponse(err);
    });
    function successResponse() {
      reply("event down post received");
    }
    function errorResponse(err) {
      reply(boom.badRequest("There was an error with your event post: " + err));
    }
  }
  return receiveActualEvent;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'config', 'database', 'post-bridge-message', 'handle-post-response' ];
