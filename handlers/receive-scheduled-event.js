var boom           = require('boom');
var util           = require('util');
var _              = require('lodash');
var Promise        = require("bluebird");

exports = module.exports = function (logger, serverConfig, db, postBridgeMessage, handlePostResponse) {
  var ScheduledEvent = db.scheduledEvent;
  var Bridge         = db.bridge;
  var bridgeStatuses = serverConfig.bridges;

  function receiveScheduledEvent(request, reply) {
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
      delete event.bridge;
      bridgeStatuses[bridge.name] = {
        status: currentStatus,
        scheduledLift: _.cloneDeep(event)
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
      Promise.all([
        ScheduledEvent.create(event),
        ScheduledEvent.count({
          where: {
            bridgeId: bridge.id
          }
        })
      ]).then(updateBridge)
        .catch(errorResponse);
      postBridgeMessage(bridgeStatuses, null, function (err, res, status) {
        handlePostResponse(status, bridgeStatuses, function (err, status) {
          if (err) logger.error("Error posting\n" + util.inspect(bridgeStatuses) + ":\n" + util.inspect(err) + "\n Status: " + status);
        });
      });

      function updateBridge(results) {
        var count = results[1] + 1;
        bridge.update({
          scheduledCount: count
        }).then(successResponse)
          .catch(errorResponse);
      }
    }).catch(errorResponse);

    function successResponse(event) {
      reply("schedule post received");
    }

    function errorResponse(err) {
      return reply(boom.badRequest("There was an error with your schedule post: " + err));
    }
  }
  return receiveScheduledEvent;
};


exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'config', 'database', 'post-bridge-message', 'handle-post-response' ];
