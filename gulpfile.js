
/**
 * Publications
 * Gulp Configuration File
 * 2015 Michael Kelly and Carlos Paelinck
 */

function logError(err) {
  console.log(err);
}

var concat = require('gulp-concat'),
  gulp = require('gulp'),
  html2js = require('gulp-html2js'),
  less = require('gulp-less'),
  path = require('path'),
  uglify = require('gulp-uglify');

var paths = {
  css: 'client/css/*.less',
  js: ['client/views/templates.js', 'client/js/_vendor/**/*.js', 'client/js/src/**/*.js'],
  templates: 'client/views/**/*.html'
};

gulp.task('less', function() {
  return gulp.src('client/css/_style.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'less', 'includes') ]
    }).on('error', function(err) {
      logError(err);
      this.emit('end');
    }))
    .pipe(gulp.dest('client/css/'));
});

gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(html2js({
      moduleName: 'pub',
      useStrict: true
    }).on('error', function(err) {
      logError(err);
      this.emit('end');
    }))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('client/views/'));
});

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('client/js/'));
});

gulp.task('js-prod', function() {
  return gulp.src(paths.js)
    .pipe(uglify({mangle: false}))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('client/js/'))
})

gulp.task('watch', function() {
  gulp.watch(paths.css, ['less']);
  gulp.watch(paths.templates, ['templates', 'js']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['less', 'templates', 'js', 'watch']);
gulp.task('production', ['less', 'templates', 'js-prod']);
