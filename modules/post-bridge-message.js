var http       = require('http');
var wlog       = require('winston');
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

  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    var status = res.statusCode;

    res.on('data', function (chunk) {
      response += chunk;
    });

    res.on('end', function () {
      if (callback) return callback(null, response, status);
      wlog.info("Request Status: " + status, response);
    });
  });

  req.on("error", function (err) {
    if (callback) return callback(err, err.message, err.code);
  });

  req.write(JSON.stringify(bridgeData));
  req.end();
};
