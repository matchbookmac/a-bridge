var https      = require('https');
var logger     = require('../config/logging');
var iBridge    = require('../config/config').iBridge;
var currentEnv = require('../config/config').env;

module .exports = function(bridgeData, options, callback){
  var response = '';

  if (!options) options = {};
  options.hostname = options.hostname || iBridge.hostname;
  options.port     = options.port     || iBridge.port;
  options.path     = options.path     || iBridge.path ;
  options.method   = options.method   || iBridge.method;
  options.headers  = options.headers  || iBridge.headers;
  options.headers["Content-Length"] = JSON.stringify(bridgeData).length;

  var req = https.request(options, function (res) {
    res.setEncoding('utf8');
    var status = res.statusCode;

    res.on('data', function (chunk) {
      response += chunk;
    });

    res.on('end', function () {
      logger.info("[%s] outgoing post %s - %s",
        require("lodash").keys(res.req.agent.sockets)[0].split(":")[0],
        req.path,
        status
      );
      if (callback) return callback(null, response, status);
      logger.info("Request Status: " + status, response);
    });
  });

  req.on("error", function (err) {
    if (callback) return callback(err, err.message, err.code);
  });

  req.write(JSON.stringify(bridgeData));
  req.end();
};
