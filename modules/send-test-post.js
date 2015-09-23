
var argv        = require('minimist')(process.argv.slice(2));
var testPost    = require('./mock-post');
var _           = require('lodash');
var options     = {};
var bridge      = argv.b || argv.bridge;
var defaultPath = argv.d || argv.defaultPath;
var hostname    = argv.h || argv.hostname;
var headers     = argv.H || argv.headers;
var liftTime    = argv.l || argv.liftTime;
var method      = argv.m || argv.method;
var multiple    = argv.M || argv.multiple || 1;
var port        = argv.p || argv.port;
var path        = argv.P || argv.path;
var timeStamp   = argv.t || argv.timestamp || new Date();
var status      = argv.s || argv.status;
var scheduled   = argv.S || argv.scheduled;
var type        = argv.T || argv.type;
var user        = argv.u || argv.user;
var othMsgVals  = argv._;

var message;
if (scheduled) {
  if (defaultPath) path = '/bridges/events/scheduled';
  var todayUTC = Date.now() + 1000 * 60 * 60 * 2;
  var defaultLiftTime = new Date(0);
  defaultLiftTime.setUTCMilliseconds(todayUTC);
  message = {
    bridge:            bridge   ? bridge   : "bailey's bridge",
    type:              status   ? status   : "testing",
    requestTime:       timeStamp.toString(),
    estimatedLiftTime: liftTime ? liftTime : defaultLiftTime
  };
} else {
  if (defaultPath) path = '/bridges/events/actual';
  message = {
    bridge:    bridge    ? bridge    : "bailey's bridge",
    status:    status    ? status    : true,
    timeStamp: timeStamp ? timeStamp : (new Date()).toString()
  };
}

if (othMsgVals.length > 0) {
  message.othMsgVals = othMsgVals;
}

if (user) {
 message = {
   email: user || "1234@thing.com"
 };
 path = '/users/new';
}

if (hostname) options.hostname = hostname;
if (port)     options.port     = port;
if (path)     options.path     = path;
if (method)   options.method   = method;
if (headers)  options.headers  = headers;

if (multiple > 1) {
  var postInterval = setInterval(function () {
    if (multiple <= 0) return clearInterval(postInterval);
    testPost(message, options);
    if (multiple > 1 && !scheduled) {
      message.status = !message.status;
    }
    multiple -= 1;
  }, 1000);
} else {
  testPost(message, options);
}
