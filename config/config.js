var env     = require('./config.json');
var ip      = require('ip');
var argv    = require('minimist')(process.argv.slice(2));

function port() {
  return argv.p || argv.port || process.env.PORT || env.aBridge.port || 8080;
}

function aBridge() {
  var tmpABridge = env.aBridge;
  if (environment() === 'test') tmpABridge.hostname = ip.address();
  return tmpABridge;
}

function iBridge() {
  var tmpIBridge = env.iBridge;
  if (environment() === 'test') tmpIBridge.hostname = ip.address();
  return tmpIBridge;
}

function environment() {
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
}

function envVars() {
  if (process.env.NODE_ENV) {
    return env[process.env.NODE_ENV];
  } else {
    var node_env = environment();
    return env[node_env];
  }
}
var bridges = env.bridges;

var bridgeOpenings = [];

module .exports = {
  port: port(),
  env: environment(),
  envVars: envVars(),
  aBridge: aBridge(),
  iBridge: iBridge(),
  bridges: bridges,
  bridgeOpenings: bridgeOpenings
};
