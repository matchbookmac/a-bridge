var Hapi            = require('hapi');
var _               = require('lodash');
var path            = require('path');
var fs              = require('fs');

exports = module.exports = function (logger, serverConfig, routes, plugins, onResponse, auth) {

  // Setup new Hapi server
  var server = new Hapi.Server();
  server.connection({ port: serverConfig.port });

  plugins(server);
  onResponse(server);
  auth(server);
  routes(server);

  return server;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'config', 'routes', 'plugins', 'response-log', 'auth' ];
