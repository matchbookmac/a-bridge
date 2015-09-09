var joi            = require('joi');
var receiveBridgeEvent = require('./handlers/receive-bridge-event');
var receiveScheduledEvent = require('./handlers/receive-scheduled-event');

module.exports = (function () {
  var routes = [
    {
      method: 'POST',
      path: '/bridges/events/actual',
      config: {
        handler: receiveBridgeEvent,
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
        handler: receiveScheduledEvent,
        // payload: {
        //   output: 'data',
        //   parse: true,
        //   allow: 'application/json'
        // },

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
})();
