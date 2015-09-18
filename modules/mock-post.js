var http     = require('http');
var logger   = require('../config/logging');
var port     = require('../config/config').port;
var aBridge  = require('../config/config').aBridge;
var ip       = require('ip');

module .exports = function testPost(bridgeData, sendOptions, callback){
  bridgeData = JSON.stringify(bridgeData);
  if (!sendOptions) sendOptions = {};
  var
    options = {
      hostname: sendOptions.hostname || aBridge.hostname || ip.address(),
      // "52.26.186.75" for a-bridge
      port:     sendOptions.port     || port,
      path:     sendOptions.path     || aBridge.path,
      method:   sendOptions.method   || aBridge.method,
      headers:  sendOptions.headers  || aBridge.headers
    },
    response = ''
  ;
  options.headers["Content-Length"] = bridgeData.length;
  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    var status = res.statusCode;

    res.on('data', function (chunk) {
      response += chunk;
    });

    res.on('end', function () {
      if (callback) callback(response, status);
      logger.info("Request Status: " + status, response);
    });
  });

  req.on("error", function (err) {
    if (callback) {
      callback(err.message, null);
    } else {
      logger.info(err);
    }
  });

  req.write(bridgeData);
  req.end();
};
