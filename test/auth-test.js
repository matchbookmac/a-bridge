var bcrypt          = require('bcrypt');

bcrypt.compare('2966e6828420dae37f4f616e74941a7e', '$2a$10$qywLkT3Thbj0cM1Ws5bBM.KzmxKcrp9E8t2agIEFL8rBJTLoY5qK2', function(err, res) {
  console.log(err);
  console.log(res);
});
