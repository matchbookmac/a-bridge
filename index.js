var
  Hapi           = require('hapi'),
  Path           = require('path'),
  wlog           = require('winston'),
  mysql          = require('mysql'),
  strftime       = require('strftime'),
  joi            = require('joi'),
  port           = require('./config/config').port,
  bridgeStatuses = require('./config/config').bridges,
  mySQLCred      = require('./config/config').mySQL,
  currentEnv     = require('./config/config').env,
  envVars        = require('./config/config').envVars,
  bridgeOpenings = []
;

wlog.add(wlog.transports.File, { filename: 'logs/winstonlog.log'});

var server = new Hapi.Server();
server.connection({ port: port });
var io     = require('socket.io')(server.listener);

var bridgeEventSocket = io.on('connection', function (socket) {
  socket.emit('bridge data', bridgeStatuses);
});


server.views({
  engines: {
    html: require('handlebars')
  },
  path: Path.join(__dirname, 'public/templates')
});

server.route({
  method: 'GET',
  path: '/',
  handler: {
    view: "index"
  }
});

server.route({
  method: 'GET',
  path: '/public/{path*}',
  handler: {
    directory: {
      path: Path.join(__dirname, '/public'),
      listing: false,
      index: false
    }
  }
});

server.route({
  method: 'POST',
  path: '/incoming-snmp',
  config: {
    handler: receivePost,
    validate: {
      payload: joi.object().keys({
        "bridge": joi.string().required(),
        "status": joi.boolean().required(),
        "timeStamp": joi.date().required()
      }),
    }
  }
});

module .exports = (function () {
  server.start(function(){
    console.log('Server running at:', server.info.uri);
  });

  return server;
})();

function receivePost(request, reply) {
  bridgeStatus = request.payload;
  var bridge = bridgeStatus.bridge;
  console.log("bridge: " + bridge);
  console.log("timestamp: " + bridgeStatus.timeStamp);
  console.log("status: " + bridgeStatus.status);
  bridgeStatuses[bridge] = {
    status: bridgeStatus.status
  };
  console.log(bridgeStatuses);
  bridgeEventSocket.emit('bridge data', bridgeStatuses);

//write data to AWS
  connection = mysql.createConnection({
    host     : mySQLCred.host,
    user     : mySQLCred.user,
    password : mySQLCred.password,
    port     : mySQLCred.port,
    database : mySQLCred.database
  });
  connection.connect(function(err){
    if (err) {
      wlog.info("MYSQL connection error: " + err.code);
      wlog.info("MYSQL connection error fatal?: " + err.fatal);
    }
    else{
      wlog.info("MYSQL connection: successful. ");
    }
  });
  bridgeName = bridgeStatus.bridge;
  bridgeName = bridgeName.replace(/\'/g, "");
  timeStamp  = strftime("%Y/%m/%d %I:%M:%S", bridgeStatus.timeStamp);
  if (bridgeStatus.status){
    console.log("(false) bridgeStatus.status = " + bridgeStatus.status);
    for (i = 0; i < bridgeOpenings.length; i++){
      //check to see if there are any open bridge events that correspond with this close event
      if (bridgeOpenings[i].name === bridgeName){
        upTime = bridgeOpenings[i].uptime;
        downTime = timeStamp;
        //build sql string
        var sql = 'INSERT INTO bridge_events (bridge_name, up_time, down_time) VALUES (' + "'" + bridgeName + "'" + ', ' + "'" + upTime + "'" + ', ' + "'" + downTime + "'" + ');';
        connection.query(sql, logConnectionErr);
        bridgeOpenings.splice(i, 1);
      }
    }
  } else {
    console.log("(true) bridgeStatus.status = " + bridgeStatus.status);

    var bridgeEvent = {
      name: bridgeName,
      uptime: timeStamp
    };
    //check to see if there are any unclosed bridge openings, if so then delete them and replace with this new bridge opening
    for (i = 0; i < bridgeOpenings.length; i++){
      if(bridgeOpenings[i].name === bridgeName){
        bridgeOpenings.splice(i, 1);
      }
    }
    bridgeOpenings.push(bridgeEvent);
  }
  reply("post received");
}

function logConnectionErr(err){
  wlog.info("SQL Error when inserting new event:  " + err);
}
