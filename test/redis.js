var redis = require("redis");
var crypto = require('crypto');
var client = redis.createClient();
client.on("error", function (err) {
    console.log("Error " + err);
});

// client.set('1234', 'user@example.com', function (err, res) {
//   console.log(err);
//   console.log(res);
//   client.quit();
// });

// client.get('thing', function (err, res) {
//   console.log(err);
//   console.log(res);
// });
//
// client.del('thing', function (err, res) {
//   console.log(err);
//   console.log(res);
// });
//
// client.get('thing', function (err, res) {
//   console.log(err);
//   console.log(res);
//  client.quit();
// });
require('crypto').randomBytes(48, function(ex, buf) {
  var token = buf.toString('hex');
  console.log(token);
});

client.quit();
