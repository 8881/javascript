/**
 * Created by G.J on 15/12/29.
 */
var gulp = require('gulp'),
    concat = require('gulp-concat'),
    cssmin = require('gulp-cssmin'),
    sass = require('gulp-ruby-sass'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    htmlrepalce = require('gulp-html-replace');

var version = Date.now().toString().slice(8);

gulp.task('scss',function(){
  return sass('src/scss/*.scss')
    .on('error', sass.logError)
    .pipe(gulp.dest('src/scss'));
});

/**********************************************/

gulp.task('img',function(){
  return gulp.src([
    'src/img/*',
  ])
  .pipe(gulp.dest('www/img'))
});

gulp.task('mincss',['scss'],function(){
  return gulp.src([
    'node_modules/normalize.css/normalize.css',
    'node_modules/font-awesome/css/font-awesome.min.css',
    'src/scss/*.css'
  ])
  .pipe(concat('lib.css'))
  .pipe(cssmin())
  .pipe(rename({
    suffix:'.'+version
  }))
  .pipe(gulp.dest('www'))
});

gulp.task('minjs',function(){
  return gulp.src([
    'node_modules/jquery/dist/jquery.min.js',
    'src/js/app.js'
  ])
    .pipe(concat('lib.js'))
    .pipe(rename({
      suffix:'.'+version
    }))
    .pipe(gulp.dest('www'))
});

gulp.task('html',function(){
  return gulp.src('src/index.html')
  .pipe(htmlrepalce({
    css: {
      src: './lib.'+version+'.css',
      tpl:'<link rel="stylesheet" href="%s" />'
    },
    js: {
      src: './lib.'+version+'.js',
      tpl:'<script src="%s"></script>'
    }
  }))
  .pipe(gulp.dest('www'))
});

/**********************************************/

gulp.task('dev',['scss'],function(){
  gulp.watch('src/scss/*.scss',['scss']);
});

gulp.task('prod',['img','mincss','minjs','html']);

gulp.task('default',function(){
  console.log('...');
});