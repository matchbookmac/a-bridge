exports = module.exports = function () {
  function addPlugins(server) {
    var plugins = [
      { register: require('inert') },
      { register: require('vision') },
      { register: require('hapi-auth-bearer-token') },
      { register: require('lout') }
    ];
    server.register(plugins, function (err) {
      if (err) logger.error(err);
    });
  }

  return addPlugins;
};

exports['@singleton'] = true;
