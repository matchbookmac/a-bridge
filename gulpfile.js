var gulp              = require('gulp');
var opts              = require('./db/database.json');
var env               = require('./config/config').env;
var mysql             = require('mysql');
var format            = require('util').format;
var os                = require('os');
var shell             = require('gulp-shell');
var dbManagerProvider = require('manage-database');
var dbName;
var testDbName = opts.test.database;
if (env != 'production') {
  dbName = opts.development.database;
  opts = opts.development;
} else {
  dbName = opts.production.database;
  opts = opts.production;
}
dbOpts = {
  user: opts.username,
  host: opts.host,
  port: opts.port,
  password: opts.password
};
var dbManager = dbManagerProvider(dbOpts);

gulp.task('default', function() {
  console.log(env);
});

gulp.task('test', function () {
  process.env.NODE_ENV = 'test';
});

// gulp.task('test', shell.task(
//   'mocha --reporter nyan',
//   {
//     env: {
//       NODE_ENV: 'test'
//     }
//   }
// ));

gulp.task('db:create', function () {
  dbManager.create(testDbName, function (err) {
    if (err) console.error("There was a problem creating " + testDbName + ": " + err);
  });
  dbManager.create(dbName, function (err) {
    if (err) console.error("There was a problem creating " + dbName + ": " + err);
  });
});

gulp.task('db:drop', function () {
  dbManager.drop(testDbName, function (err) {
    if (err) console.error("There was a problem creating " + dbName + ": " + err);
  });
  dbManager.drop(dbName, function (err) {
    if (err) console.error("There was a problem creating " + dbName + ": " + err);
  });
});

gulp.task('db:migrate', shell.task('sequelize db:migrate --config db/database.json --env development'));
gulp.task('db:migrate:production', shell.task('sequelize db:migrate --config db/database.json --env production'));
gulp.task('db:test:prepare', shell.task('sequelize db:migrate --config db/database.json --env test'));

gulp.task('db:seed', function () {
  require('./db/seeds');
});
gulp.task('db:seed:production', function () {
  process.env.NODE_ENV = 'production';
  require('./db/seeds');
});
