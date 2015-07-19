'use strict';
/**
 * Publications
 * Gulp Configuration File
 * 2015 Michael Kelly and Carlos Paelinck
 */

function logError(err) {
  console.log(err);
}

var babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  gulp = require('gulp'),
  html2js = require('gulp-html2js'),
  less = require('gulp-less'),
  path = require('path'),
  uglify = require('gulp-uglify');

var paths = {
  css: ['css/*.less'],
  js: ['js/_vendor/**/*.js', 'js/src/**/*.js'],
  templates: 'views/**/*.html'
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
    .pipe(gulp.dest('views/'));
});

gulp.task('templates-prod', function() {
  return gulp.src(paths.templates)
    .pipe(html2js({
      moduleName: 'pub',
      useStrict: true
    }).on('error', function(err) {
      logError(err);
      this.emit('end');
    }))
    .pipe(uglify({mangle: false}))
    .pipe(concat('templates.js'))
    .pipe(gulp.dest('views/'));
});

gulp.task('js', function() {
  return gulp.src(paths.js)
    .pipe(concat('app.min.js'))
    .pipe(babel())
    .pipe(gulp.dest('js/'));
});

gulp.task('js-prod', function() {
  return gulp.src(paths.js)
    .pipe(babel())
    .pipe(uglify({mangle: false}))
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('js/'));
});

gulp.task('watch', function() {
  gulp.watch(paths.css, ['less']);
  gulp.watch(paths.templates, ['templates', 'js']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('default', ['less', 'templates', 'js', 'watch']);
gulp.task('production', ['less', 'templates-prod', 'js-prod']);
