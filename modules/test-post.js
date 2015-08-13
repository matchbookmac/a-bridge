var
  http     = require('http'),
  wlog     = require('winston'),
  ip       = require('ip')
;

var timeStamp = (new Date()).toString();

var testMessage = {
    bridge: "bailey's bridge",
    status: true,
    timeStamp:timeStamp
  };

testPost(testMessage);

function testPost(bridgeData, callback){
  bridgeData = JSON.stringify(bridgeData);
  var
    options = {
      hostname: ip.address(),
      // "52.26.186.75",
      // hostname: "127.0.0.1",
      port: 80,
      path: "/incoming-snmp",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": bridgeData.length
      }
    },
    response = ''
  ;

  var req = http.request(options, function (res) {
    res.setEncoding('utf8');
    var status = res.statusCode;

    res.on('data', function (chunk) {
      response += chunk;
    });

    res.on('end', function () {
      if (callback) callback(response, status);
      wlog.info("Request Status: " + status, response);
    });
  });

  req.on("error", function (err) {
    if (callback) callback(err.message, null);
  });

  req.write(bridgeData);
  req.end();
}
