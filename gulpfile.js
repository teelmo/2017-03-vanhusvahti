// Gulp Dependencies
process.argv.push('--silent');
var gulp = require('gulp');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var gif = require('gulp-if');
var args = require('yargs').argv;
var runSequence = require('run-sequence');
var sourcemaps = require('gulp-sourcemaps');

// Html Dependencies
var htmlmin = require('gulp-htmlmin');

// Style Dependencies
var less = require('gulp-less');
var cleancss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');

// Javascript Dependencies
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');
var jshint = require('gulp-jshint');
var stripDebug = require('gulp-strip-debug');

// LiveReload Dependencies
// var browserSync = require("browser-sync").create();
var livereload = require('gulp-livereload');
var live = 'livereload()';

gulp.task('default', function () {
  runSequence('livereload');
  runSequence('watch');
});


gulp.task('livereload', function () {
  live = 'livereload()';
  livereload.listen();
});

// gulp.task('browser-sync', function() {
//   live = 'browserSync.stream()';
//   browserSync.init({
//     proxy: "dev2.yle.fi"
//   });
// });

gulp.task('watch', function () {
  // Watch Html.
  gulp.watch('index.html', function (file) {
    runSequence('build-html');
  }).on('error', function (err) {
    gutil.log(err);
  });

  // Watch CSS.
  gulp.watch('css/styles.less', function (file) {
    runSequence('build-css');
  }).on('error', function (err) {
    gutil.log(err);
  });

  // Watch JS.
  gulp.watch('js/script.js', function (file) {
    runSequence('build-js');
  }).on('error', function (err) {
    gutil.log(err);
  });
});

// Build all.
gulp.task('build', function() {
  runSequence('build-html');
  runSequence('build-css');
  runSequence('build-js');
});

// Build Html.
gulp.task('build-html', function() {
  if (args.env === 'prod') {
    return gulp.src(['./index.html'])
      .pipe(htmlmin({
        collapseWhitespace:true
      }))
      .pipe(gulp.dest('./public'))
      .pipe(eval(live));
  }
  else {
    return gulp.src(['./index.html'])
      .pipe(gulp.dest('./public'))
      .pipe(eval(live));
  }
});

// Build CSS.
gulp.task('build-css', function() {
  if (args.env === 'prod') {
    return gulp.src(['./css/styles.less'])
      .pipe(sourcemaps.init())
      .pipe(less()).on('error', function (err) {
        gutil.log(err);
        this.emit('end');
      })
      .pipe(autoprefixer({
        browsers:['last 2 versions'],
        cascade:false
      }))
      .pipe(cleancss())
      .pipe(concat('styles.min.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css')).on('error', gutil.log)
      .pipe(gif('*.css', eval(live)));
  }
  else {
    return gulp.src(['./css/styles.less'])
      .pipe(sourcemaps.init())
      .pipe(less()).on('error', function (err) {
        gutil.log(err);
        this.emit('end');
      })
      .pipe(autoprefixer({
        browsers:['last 2 versions'],
        cascade:false
      }))
      .pipe(cleancss())
      .pipe(concat('styles.min.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/css')).on('error', gutil.log)
      .pipe(gif('*.css', eval(live)));
  }
});

// Build JS.
gulp.task('build-js', ['lint'], function () {
  var b = browserify({
    entries:'./js/script.js',
    insertGlobals:false,
    debug:false
  });

  if (args.env === 'prod') {
    return b.bundle()
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(uglify({
        compress:true,
        mangle:true,
        mangleRegex:/^(?!define).*/
      }))
      .on('error', function (err) {
        gutil.log(err);
        this.emit('end');
      })
      .pipe(stripDebug())
      .pipe(concat('script.min.js'))
      .pipe(insert.wrap('(function () { var define = undefined;','})();'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/js')).on('error', gutil.log)
      .pipe(gif('*.js', eval(live)));
  }
  else {
    return b.bundle()
      .pipe(source('script.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .on('error', function (err) {
        gutil.log(err);
        this.emit('end');
      })
      .pipe(concat('script.min.js'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('./public/js')).on('error', gutil.log)
      .pipe(gif('*.js', eval(live)));
  }
});

// Linting.
gulp.task('lint', function () {
  return gulp.src('./js/script.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
