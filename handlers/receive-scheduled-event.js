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
    Bridge.findOne({ where: { name: bridge } }).then(function (bridge) {
      // Do not proceede if bridge does not exist
      if (!bridge) {
        logger.warn('Could not find bridge: '+ bridge);
        return errorResponse('Could not find bridge: '+ bridge);
      }
      // Assemble current status for bridge
      var currentStatus, currentScheduledLifts, lastFive, upTime;
      if (bridgeStatuses[bridge.name]) {
        currentStatus = bridgeStatuses[bridge.name].status;
        currentScheduledLifts = bridgeStatuses[bridge.name].scheduledLifts;
        lastFive = bridgeStatuses[bridge.name].lastFive;
        upTime = bridgeStatuses[bridge.name].upTime;
      } else {
        currentStatus = false;
        currentScheduledLifts = [];
        lastFive = [];
      }
      delete event.bridge;
      currentScheduledLifts.splice(_.sortedLastIndex(currentScheduledLifts, event, 'estimatedLiftTime'), 0, event);
      bridgeStatuses[bridge.name] = {
        status: currentStatus,
        scheduledLifts: currentScheduledLifts,
        lastFive: lastFive
      };
      if (upTime) bridgeStatuses[bridge.name].upTime = upTime;
      event.bridgeId = bridge.id;
      bridgeStatuses.changed.bridge = bridge.name;
      bridgeStatuses.changed.item = "scheduledLifts";
      logger.info("%s %s lift scheduled\n      Scheduled lifts for %s:\n%s\n",
        bridge.name,
        _.last(bridgeStatuses[bridge.name].scheduledLifts).type,
        bridge.name,
        util.inspect(currentScheduledLifts)
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
          if (err) logger.error("Error posting\n" + util.inspect(bridgeStatuses, { depth: 3 }) + ":\n" + util.inspect(err) + "\n Status: " + status);
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
