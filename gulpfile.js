
/**
 * Publications
 * Gulp Configuration File
 * 2015 Michael Kelly and Carlos Paelinck
 */

var
  gulp  = require('gulp'),
  karma = require('karma').server;

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});
