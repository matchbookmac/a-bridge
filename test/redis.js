var redis = require("redis");
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var serverConfig = require('../config/config');

var redisStore = redis.createClient(serverConfig.redis.port, serverConfig.redis.host);
if (serverConfig.redis.password) {
  redisStore.auth(serverConfig.redis.password, function (err, res) {
    if (err) return console.log('Problem connecting to redis: '+ err);
    console.log('Connected to Redis at: '+ redisStore.address);
  });
} else {
  console.log('Connected to Redis at: '+ redisStore.address);
}
redisStore.on("error", function (err) {
  console.log("Error " + err);
});
// crypto.randomBytes(16, function(ex, buf) {
//   var token = buf.toString('hex');
//   var hashToken;
//   console.log(token);
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(token, salt, function(err, hash) {
//       if (err) return console.log(err);
//       hashToken = hash;
//       console.log(hashToken);
//       redisStore.set('lbridge@co.multnomah.or.us', hashToken, function (err, res) {
//         console.log(err);
//         console.log(res);
//       });
//     });
//   });
// });
// crypto.randomBytes(16, function(ex, buf) {
//   var token = buf.toString('hex');
//   var hashToken;
//   console.log(token);
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(token, salt, function(err, hash) {
//       if (err) return console.log(err);
//       hashToken = hash;
//       console.log(hashToken);
//       redisStore.set('abridge@api.multco.us', hashToken, function (err, res) {
//         console.log(err);
//         console.log(res);
//       });
//     });
//   });
// });
// crypto.randomBytes(16, function(ex, buf) {
//   var token = buf.toString('hex');
//   var hashToken;
//   console.log(token);
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(token, salt, function(err, hash) {
//       if (err) return console.log(err);
//       hashToken = hash;
//       console.log(hashToken);
//       redisStore.set('ibridge@api.multco.us', hashToken, function (err, res) {
//         console.log(err);
//         console.log(res);
//       });
//     });
//   });
// });

// redisStore.get('thing', function (err, res) {
//   console.log(err);
//   console.log(res);
// });
//
redisStore.del('ibridge@api.multco.us', function (err, res) {
  console.log(err);
  console.log(res);
  redisStore.quit();
});
//
// redisStore.get('thing', function (err, res) {
//   console.log(err);
//   console.log(res);
//  redisStore.quit();
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


// redisStore.quit();
