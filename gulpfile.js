
/**
 * Publications
 * Gulp Configuration File
 * 2015 Michael Kelly and Carlos Paelinck
 */

function logError(err) {
  console.log(err);
}

var
  babelify    = require('babelify'),
  buffer      = require('vinyl-buffer'),
  gulp        = require('gulp'),
  karma       = require('karma').server,
  less        = require('gulp-less'),
  path        = require('path'),
  rename      = require('gulp-rename'),
  source      = require('vinyl-source-stream'),
  sourceMaps  = require('gulp-sourcemaps'),
  uglify      = require('gulp-uglify'),
  watchify    = require('watchify'),
  webpack     = require('gulp-webpack');

var paths = {
  css: ['css/*.less'],
  js: ['js/_vendor/**/*.js', 'js/src/**/*.js']
};

gulp.task('less', function() {
  return gulp.src('css/_style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }).on('error', function(err) {
      logError(err);
      this.emit('end');
    }))
    .pipe(gulp.dest('css/'));
});

gulp.task('test', function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: false
  }, done);
});

gulp.task('webpack', function() {
  return gulp.src('./js/src/app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./js'));
});

gulp.task('core', ['less', 'webpack']);
gulp.task('dev', ['core']);

gulp.task('watch:dev', function() {
  gulp.watch(paths.css, ['less']);
  gulp.start('dev');
});
