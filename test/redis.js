var redis = require("redis");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var serverConfig = require('../config/config');

var client = redis.createClient(serverConfig.redis.port, serverConfig.redis.host);
client.auth(serverConfig.redis.password, function (err, res) {
  if (err) return console.log('Problem connecting to redis: '+ err);
  console.log('Connected to Redis at: '+ client.address);
});
client.on("error", function (err) {
    console.log("Error " + err);
});
crypto.randomBytes(16, function(ex, buf) {
  var token = buf.toString('hex');
  var hashToken;
  console.log(token);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(token, salt, function(err, hash) {
      if (err) return console.log(err);
      hashToken = hash;
      console.log(hashToken);
      client.set('lbridge@co.multnomah.or.us', hashToken, function (err, res) {
        console.log(err);
        console.log(res);
      });
    });
  });
});
crypto.randomBytes(16, function(ex, buf) {
  var token = buf.toString('hex');
  var hashToken;
  console.log(token);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(token, salt, function(err, hash) {
      if (err) return console.log(err);
      hashToken = hash;
      console.log(hashToken);
      client.set('abridge@api.multco.us', hashToken, function (err, res) {
        console.log(err);
        console.log(res);
      });
    });
  });
});
crypto.randomBytes(16, function(ex, buf) {
  var token = buf.toString('hex');
  var hashToken;
  console.log(token);
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(token, salt, function(err, hash) {
      if (err) return console.log(err);
      hashToken = hash;
      console.log(hashToken);
      client.set('ibridge@api.multco.us', hashToken, function (err, res) {
        console.log(err);
        console.log(res);
      });
    });
  });
});

// client.get('thing', function (err, res) {
//   console.log(err);
//   console.log(res);
// });
//
// client.del('1234', function (err, res) {
//   console.log(err);
//   console.log(res);
//   client.quit();
// });
//
// client.get('thing', function (err, res) {
//   console.log(err);
//   console.log(res);
//  client.quit();
// });
// var hashToken;
// var token;
// require('crypto').randomBytes(16, function(ex, buf) {
//   token = buf.toString('hex');
//   console.log(token);
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(token, salt, function(err, hash) {
//       if (err) return console.log(err);
//       hashToken = hash;
//       console.log(hashToken);
//       bcrypt.compare(token, hashToken, function(err, res) {
//         if (err) return console.log(err);
//         console.log(res);
//       });
//       bcrypt.compare('not_bacon', hashToken, function(err, res) {
//         if (err) return console.log(err);
//         console.log(res);
//       });
//     });
//   });
// });


// client.quit();
