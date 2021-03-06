var injector = require('electrolyte');
injector.loader(injector.node('config'));
injector.loader(injector.node('modules'));
var mockPost = injector.create('./mock-post');
var config   = injector.create('config');

var argv        = require('minimist')(process.argv.slice(2));
var _           = require('lodash');
var options     = {};

var bridge      = argv.b || argv.bridge;
var defaultPath = argv.d || argv.defaultPath;
var deleteUsr   = argv.D || argv.delete;
var hostname    = argv.h || argv.hostname;
var headers     = argv.H || argv.headers;
var liftTime    = argv.l || argv.liftTime;
var method      = argv.m || argv.method;
var multiple    = argv.M || argv.multiple || 1;
var port        = argv.p || argv.port;
var path        = argv.P || argv.path;
var status      = argv.s || argv.status;
var scheduled   = argv.S || argv.scheduled;
var timeStamp   = argv.t || argv.timestamp || new Date().toUTCString();
var type        = argv.T || argv.type;
var user        = argv.u || argv.user;
var email       = argv.e || argv.email;
var token       = argv.y || argv.token;
var othMsgVals  = argv._;

var message;
if (scheduled) {
  if (defaultPath) path = '/bridges/events/scheduled';
  var today2hrDelay = Date.now() + 1000 * 60 * 60 * 2;
  var defaultLiftTime = new Date(today2hrDelay).toUTCString();
  message = {
    bridge:            bridge   ? bridge   : "bailey's bridge",
    type:              status   ? status   : "testing",
    requestTime:       timeStamp,
    estimatedLiftTime: liftTime ? liftTime : defaultLiftTime
  };
} else {
  if (defaultPath) path = '/bridges/events/actual';
  message = {
    bridge:    bridge    ? bridge    : "bailey's bridge",
    status:    status    ? status    : true,
    timeStamp: timeStamp
  };
}

if (othMsgVals.length > 0) {
  message.othMsgVals = othMsgVals;
}

if (user) {
  message = {
    email: user || "1234@thing.com"
  };
  if (token) {
    path = '/users/'+user+'/token';
    message = {
      token: token.toString() || '1234'
    };
    method = 'PATCH';
  } else if (email) {
    path = '/users/'+user+'/email';
    message.email = email;
    method = 'PATCH';
  } else if (deleteUsr) {
    path = '/users/'+user+'/destroy';
    message = null;
    method = 'DELETE';
  } else {
    path = '/users/new';
  }
}

if (hostname) options.hostname = hostname;
if (port)     options.port     = port;
if (path)     options.path     = path;
if (method)   options.method   = method;
if (headers)  options.headers  = headers;

if (multiple > 1) {
  var postInterval = setInterval(function () {
    if (multiple <= 0) return clearInterval(postInterval);
    mockPost(message, options);
    if (multiple > 1 && !scheduled) {
      message.status = !message.status;
    }
    multiple -= 1;
  }, 1000);
} else {
  mockPost(message, options);
}
