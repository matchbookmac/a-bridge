
var wlog               = require('winston');
var util               = require('util');
var retry              = require('retry');
var postBridgeMessage  = require('./post-bridge-message');
var iBridge            = require('../config/config').iBridge;
var bridges            = require('../config/config').bridges;
var currentEnv         = require('../config/config').env;

function twoHundred(bridgeData, callback){
  callback(null, 200);
}

function fourHundred(bridgeData, callback){
  callback('Malformed or incorrect post payload', 400);
}

function fourZeroFour(bridgeData, callback){
  postBridgeMessage(bridgeData, iBridge, function (err, res, status) {
    postRequestRetryCallback(err ,res, status, bridgeData, callback);
  });
}

function exponentialRetry(bridgeData, callback) {
  var operation = retry.operation({ retries: 4 });

  operation.attempt(function () {
    postBridgeMessage(bridgeData, iBridge, function (err, res, status) {
      switch (status) {
        case 200:
          wlog.info('Retry for:\n' + util.inspect(bridgeData) + '\nsuccessful');
          return callback(null, status);
        case 500: case 503: case 504: case "ECONNREFUSED":
          if (operation.retry({ err: err, response: res })) {
            return;
          }
          callback(operation.mainError(), status);
          break;
        default:
          handlePostResponse(status, bridgeData, callback);
      }
    });
  });
}

function postRequestRetryCallback(err, res, status, message, callback) {
  if (status === 200) {
    wlog.info('Retry for:\n' + util.inspect(message) + '\nsuccessful');
    return callback(null, status);
  } else if (postResponses[status.toString()]) {
    wlog.error('Retry for:\n' + util.inspect(message) + '\nunsucessful with HTTP error: ' + status);
    return callback(err, status);
  }
}

function handlePostResponse(status, bridgeMessage, callback) {
  postStatus = status.toString();
  var that = this;
  if (postResponses[postStatus]) {
    postResponses[postStatus].call(that, bridgeMessage, callback);
  } else {
    wlog.error('Unknown Response Status: ' + status + ', Unsure how to handle');
  }
}

var postResponses = {
  "200": twoHundred,
  "400": fourHundred,
  "404": fourZeroFour,
  "500": exponentialRetry,
  "503": exponentialRetry,
  "504": exponentialRetry,
  "ECONNREFUSED": exponentialRetry
};

module.exports = handlePostResponse;
