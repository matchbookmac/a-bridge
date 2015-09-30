var ip = require('ip');

exports = module.exports = function (logger, serverConfig) {
  var env     = serverConfig.env;
  var aBridge = serverConfig.aBridge;
  var http    = env === 'production' ? require('https') : require('http');

  function mockPost(bridgeData, options, callback){
    bridgeData = JSON.stringify(bridgeData);
    var response = '';

    if (!options) options = {};
    options.hostname = options.hostname || aBridge.hostname || ip.address();
    // "a-bridge.api.multco.us" for a-bridge
    options.port     = options.port     || aBridge.port;
    options.path     = options.path     || aBridge.path ;
    options.method   = options.method   || aBridge.method;
    options.headers  = options.headers  || aBridge.headers;
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
  }
  return mockPost;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger', 'config' ];
