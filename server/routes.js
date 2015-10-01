var joi = require('joi');

exports = module.exports = function (createNewUser, receiveActualEvent, receiveScheduledEvent) {
  function addRoutes(server) {
    server.route([
      {
        method: 'POST',
        path: '/users/new',
        config: {
          handler: createNewUser,
          validate: {
            payload: joi.object().keys({
              "email": joi.string().email().required()
            }),
          },
          auth: 'simple',
          description: 'Receives actual bridge lift events from l-bridge. Stores payload in database, and notifies users of a lift event',
          notes: 'Requires an object with the keys `bridge`, `status`, and `timeStamp` that are a string, boolean, and date respectively. Authentication is specified by an Authentication header, such as: `Authorization: Bearer user@example.com:1234` where the Bearer is a combination of the user\'s email followed by a `:` and then their access token.',
          tags: ['secure', 'registration']
        }
      },

      {
        method: 'POST',
        path: '/bridges/events/actual',
        config: {
          handler: receiveActualEvent,
          validate: {
            payload: joi.object().keys({
              "bridge": joi.string().required(),
              "status": joi.boolean().required(),
              "timeStamp": joi.date().required()
            }),
          },
          auth: 'simple',
          description: 'Receives actual bridge lift events from l-bridge. Stores payload in database, and notifies users of a lift event',
          notes: 'Requires an object with the keys `bridge`, `status`, and `timeStamp` that are a string, boolean, and date respectively. Authentication is specified by an Authentication header, such as: `Authorization: Bearer user@example.com:1234` where the Bearer is a combination of the user\'s email followed by a `:` and then their access token.',
          tags: ['secure', 'notification']
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
          notes: 'Requires an object with the keys `bridge`, `type`, `requestTime`, and `estimatedLiftTime` that are a string, string, date, and date respectively. Authentication is specified by an Authentication header, such as: `Authorization: Bearer user@example.com:1234` where the Bearer is a combination of the user\'s email followed by a `:` and then their access token.',
          tags: ['secure', 'notification']
        }
      }
    ]);
  }

  return addRoutes;
};

exports['@singleton'] = true;
exports['@require'] = [ 'create-new-user', 'receive-actual-event', 'receive-scheduled-event' ];