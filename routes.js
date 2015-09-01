var Path           = require('path');
var wlog           = require('winston');
var joi            = require('joi');
var Promise        = require('promise');
var bridgeStatuses = require('./config/config').bridges;
var bridgeOpenings = [];
var notifyUsers = require('./handlers/notify-users');
var receiveBridgeEvent = require('./handlers/receive-bridge-event');
var receiveScheduledEvent = require('./handlers/receive-scheduled-event');

module.exports = function (eventEmitters) {
  var routes = [
    {
      method: 'GET',
      path: '/sse',
      config: {
        handler: function (request, reply) {
          var response = reply(eventEmitters.bridgeSSE);
          response.code(200)
                  .type('text/event-stream')
                  .header('Connection', 'keep-alive')
                  .header('Cache-Control', 'no-cache')
                  .header('Content-Encoding', 'identity')
                  .header('Access-Control-Allow-Origin', '*');

          setTimeout(function () {
            eventEmitters.bridgeSSE.write('event: bridge data\ndata: ' + JSON.stringify(bridgeStatuses) + '\n\nretry: 1000\n');
          }, 1000);

          var interval = setInterval(function () {
            eventEmitters.bridgeSSE.write(': stay-alive\n\n');
          }, 20000);
          request.once('disconnect', function () {
            clearInterval(interval);
          });
        }
      }
    },

    {
      method: 'GET',
      path: '/mobile',
      config: {
        handler: {
          view: "mobile-index"
        },
        description: 'Renders page for the user to watch real-time bridge lifts.',
        tags: ['notification']
      }
    },

    {
      method: 'GET',
      path: '/mobile/feed',
      config: {
        handler: {
          view: "mobile-feed"
        },
        description: 'Renders page for the user to the bridge twitter feed.',
        tags: ['notification']
      }
    },

    {
      method: 'GET',
      path: '/mobile/terms',
      config: {
        handler: {
          view: "mobile-terms"
        },
        description: 'Renders page for the user to the terms of the app.',
        tags: ['notification']
      }
    },

    {
      method: 'GET',
      path: '/public/{path*}',
      handler: {
        directory: {
          path: Path.join(__dirname, '/public'),
          listing: false,
          index: false
        }
      }
    },

    {
      method: 'POST',
      path: '/bridges/events/actual',
      config: {
        handler: function (request, reply) {
          notifyUsers(request, bridgeStatuses, eventEmitters);
          receiveBridgeEvent(request, reply, bridgeOpenings);
        },
        validate: {
          payload: joi.object().keys({
            "bridge": joi.string().required(),
            "status": joi.boolean().required(),
            "timeStamp": joi.date().required()
          }),
        },
        auth: 'simple',
        description: 'Receives actual bridge lift events from l-bridge. Stores payload in database, and notifies users of a lift event',
        notes: 'Requires an object with the keys `bridge`, `status`, and `timeStamp` that are a string, boolean, and date respectively Authentication is specified by an access token as a query parameter, i.e. `/bridges/events/actual?access_token=1234`.',
        tags: ['api', 'secure', 'notification']
      }
    },

    {
      method: 'POST',
      path: '/bridges/events/scheduled',
      config: {
        handler: function (request, reply) {
          notifyUsers(request, bridgeStatuses, eventEmitters);
          receiveScheduledEvent(request, reply);
        },
        validate: {
          payload: joi.object().keys({
            "bridge": joi.string().required(),
            "type": joi.string().required(),
            "requestTime": joi.date().required(),
            "estimatedLiftTime": joi.date().required()
          }),
        },
        auth: 'simple',
        description: 'Receives scheduled bridge lift events from multco.us. Stores payload in database, and notifies users of a scheduled lift event',
        notes: 'Requires an object with the keys `bridge`, `type`, `requestTime`, and `estimatedLiftTime` that are a string, string, date, and date respectively Authentication is specified by an access token as a query parameter, i.e. `/bridges/events/scheduled?access_token=1234`.',
        tags: ['api', 'secure', 'notification']
      }
    }
  ];

  return routes;
};
