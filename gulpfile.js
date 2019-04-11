var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');
var clean = require('gulp-clean');
var usemin = require('gulp-usemin');
var minifyHtml = require('gulp-minify-html');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss'],
  sass2: ['./www/scss/**/*.scss'],
  src: './www',
  target : './target'
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('sass2', function(done) {
  gulp.src('./www/scss/app.scss')
    .pipe(sass({
      errLogToConsole: true
    }))
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});


gulp.task('watch', function() {
  gulp.watch(paths.sass2, ['sass2']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});


gulp.task('clean', function(){
  return gulp.src([paths.target], {read:false})
  .pipe(clean());
});


gulp.task('dev', ['clean'], function(){
  gulp.src(paths.src + '/**/*.*', { base: paths.src })
  .pipe(gulp.dest(paths.target));
});

gulp.task('prod', ['clean'], function() {
   gulp.run('release');
});

gulp.task('release', ['css', 'html', 'move']);
// gulp.task('release', ['css', 'js', 'move']);

gulp.task('move', function(){
  gulp.src([
        paths.src + '/lib/**/*.*',
        '!' + paths.src + '/lib/**/*.scss',
        '!' + paths.src + '/lib/**/*.min.js',
        paths.src + '/img/**/*.*',
    ], { base: paths.src })
  .pipe(gulp.dest(paths.target));
});

gulp.task('html', function() {
   gulp.src([
        paths.src + '/templates/**/*.*',
        paths.src + '/index.html'
    ], { base: paths.src })
  .pipe(usemin({
        js: [ngAnnotate(), uglify()]
      }))
  .pipe(minifyHtml())
  .pipe(gulp.dest(paths.target));
})


gulp.task('js', function() {
  gulp.src( paths.src + '/js/**/*.js')
    .pipe(ngAnnotate())
    .pipe(uglify(
        {outSourceMap: false}
      ))
    .pipe(gulp.dest(paths.target + '/js'))
});

gulp.task('concat', function () {
    gulp.src( paths.src + '/js/**/*.js')
        .pipe(concat('app.js'))//合并后的文件名
        .pipe(ngAnnotate())
        .pipe(uglify(
            {outSourceMap: false}
          ))
        .pipe(gulp.dest(paths.target + '/js'));
});


gulp.task('css', function() {
   gulp.src(paths.src + '/css/*.css')
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(gulp.dest(paths.target + '/css'))
});
