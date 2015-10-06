var joi = require('joi');

exports = module.exports = function (createUser, receiveActualEvent, receiveScheduledEvent, getUsers, updateUserEmail, updateUserToken, deleteUser) {
  function addRoutes(server) {
    server.route([
      {
        method: 'POST',
        path: '/users/new',
        config: {
          handler: createUser,
          validate: {
            payload: joi.object().keys({
              "email": joi.string().email().required()
            }),
          },
          auth: 'simple',
          description: 'Creates a new user with an automatically generated token',
          notes: 'Requires a payload of an object with the key `email`',
          tags: ['secure', 'registration']
        }
      },

      {
        method: 'GET',
        path: '/users',
        config: {
          handler: getUsers,
          auth: 'simple',
          description: 'Retrieves all users',
          notes: 'Returns an array of emails for all users.',
          tags: ['secure', 'registration']
        }
      },

      {
        method: 'PATCH',
        path: '/users/{email}/email',
        config: {
          handler: updateUserEmail,
          validate: {
            params: {
              email: joi.string().email().required()
            },
            payload: joi.object().keys({
              email: joi.string().email().required()
            }),
          },
          auth: 'simple',
          description: 'Updates a user\'s email',
          notes: 'If no e-mail is passed in the payload, the user\'s email will not be updated',
          tags: ['secure', 'registration']
        }
      },

      {
        method: 'PATCH',
        path: '/users/{email}/token',
        config: {
          handler: updateUserToken,
          validate: {
            params: {
              email: joi.string().email().required(),
            },
            payload: joi.object().keys({
              token: joi.string().token()
            })
          },
          auth: 'simple',
          description: 'Updates a user\'s token',
          notes: 'If no token is passed in the payload, a new random token will be generated, otherwise, the user\'s token is set to the token in the payload',
          tags: ['secure', 'registration']
        }
      },

      {
        method: 'DELETE',
        path: '/users/{email}/destroy',
        config: {
          handler: deleteUser,
          validate: {
            params: {
              email: joi.string().email().required(),
            }
          },
          auth: 'simple',
          description: 'Deletes a user and their token',
          notes: 'Removes a user from the database, revoking their authentication',
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
exports['@require'] = [ 'create-user', 'receive-actual-event', 'receive-scheduled-event', 'get-users', 'update-user-email', 'update-user-token', 'delete-user' ];
