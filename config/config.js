var ip      = require('ip');
var stream  = require('stream');
var path    = require('path');
var fs      = require('fs');
var argv    = require('minimist')(process.argv.slice(2));

var currentEnv = (function environment() {
  var argvEnv = argv.E || argv.env || process.env.NODE_ENV;
  var node_env;

  if (argvEnv === 'production' || argvEnv === 'prod') {
    node_env = process.env.NODE_ENV = 'production';
  } else if (argvEnv === 'test') {
    node_env = process.env.NODE_ENV = 'test';
  } else {
    node_env = process.env.NODE_ENV = 'development';
  }
  return node_env;
})();

var envVars = require('./config.json')[currentEnv];

function port() {
  return argv.p || argv.port || process.env.PORT || envVars.aBridge.port || 8080;
}

function aBridge() {
  return envVars.aBridge;
}

function iBridge() {
  return envVars.iBridge;
}

function redis() {
  return envVars.redis;
}

function database() {
  // We overwrite database.json with the database config in config.json
  // That way we maintain db config in just one place. We need this
  // database.json file in order for sequelize to work
  var configJSON = require('./config.json');
  var stream = fs.createWriteStream(path.resolve(__dirname,
    '../models/db/database.json'),
    { flags: 'w', encoding: 'utf8', mode: 0666 }
  );
  stream.write(JSON.stringify({
    development: configJSON.development.database,
    test: configJSON.test.database,
    production: configJSON.production.database
  }));
  return envVars.database;
}

var bridges = envVars.bridges;

var bridgeOpenings = [];

exports = module.exports = function () {
  var config = {
    port: port(),
    env: currentEnv,
    envVars: envVars,
    aBridge: aBridge(),
    iBridge: iBridge(),
    redis: redis(),
    database: database(),
    bridges: bridges,
    bridgeOpenings: bridgeOpenings
  };
  return config;
};

exports['@singleton'] = true;
