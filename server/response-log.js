exports = module.exports = function (logger) {
  function addResponseLogging(server) {
    server.on('response', function (request) {
      logger.info("[%s] incoming %s %s - %s",
        request.headers['x-forwarded-for'] || request.info.remoteAddress,
        request.method,
        request.url.path,
        request.response.statusCode
      );
    });
  }

  return addResponseLogging;
};

exports['@singleton'] = true;
exports['@require'] = [ 'logger' ];
