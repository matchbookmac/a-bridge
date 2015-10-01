var gulp              = require('gulp');
var mysql             = require('mysql');
var format            = require('util').format;
var os                = require('os');
var shell             = require('gulp-shell');
var dbManagerProvider = require('manage-database');
var injector          = require('electrolyte');

injector.loader(injector.node('config'));
injector.loader(injector.node('server'));
injector.loader(injector.node('models/db'));

var logger = injector.create('logger');
var config = injector.create('config');
var redis = injector.create('redis');
var seed = injector.create('seeds');

var dbOpts = config.database;
var env    = config.env;

var dbName = dbOpts.database;
var testDbName = "a_bridge_test";

var dbManager = dbManagerProvider({
  user: dbOpts.username,
  host: dbOpts.host,
  port: dbOpts.port,
  password: dbOpts.password
});

gulp.task('default', function() {
  logger.info(env);
  redis.quit();
});

gulp.task('test', shell.task('NODE_ENV=test mocha --reporter nyan -c'));

// gulp.task('test', shell.task(
//   'mocha --reporter nyan',
//   {
//     env: {
//       NODE_ENV: 'test'
//     }
//   }
// ));

gulp.task('db:create', function () {
  if (env != 'production') {
    dbManager.create(testDbName, function (err) {
      if (err) logger.error("There was a problem creating " + testDbName + ": " + err);
    });
  }
  dbManager.create(dbName, function (err) {
    if (err) logger.error("There was a problem creating " + dbName + ": " + err);
  });
  redis.quit();
});

gulp.task('db:drop', function () {
  if (env != 'production') {
    dbManager.drop(testDbName, function (err) {
      if (err) logger.error("There was a problem dropping " + dbName + ": " + err);
    });
  }
  dbManager.drop(dbName, function (err) {
    if (err) logger.error("There was a problem dropping " + dbName + ": " + err);
  });
  redis.quit();
});

gulp.task('db:migrate', shell.task('sequelize db:migrate --config models/db/database.json --env development'));

gulp.task('db:migrate:undo', shell.task('sequelize db:migrate:undo --config models/db/database.json --env development'));

gulp.task('db:migrate:production', shell.task('sequelize db:migrate --config models/db/database.json --env production'));

gulp.task('db:test:prepare', shell.task('sequelize db:migrate --config models/db/database.json --env test'));

gulp.task('db:seed:mysql', function () {
  seed.mysql();
});

gulp.task('db:seed:redis', function () {
  seed.redis();
});

// gulp.task('db:seed:production', function () {
//   process.env.NODE_ENV = 'production';
//   injector.loader(injector.node('config'));
//   injector.loader(injector.node('server'));
//   injector.loader(injector.node('models/db'));
//
//   logger = injector.create('logger');
//   config = injector.create('config');
//   redis = injector.create('redis');
//   seed = injector.create('seeds');
//   logger.info(config.env);
//   seed.mysql();
//   redis.quit();
// });
