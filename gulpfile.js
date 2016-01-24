'use strict';
var require;
var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    del = require('del'),

    browserify = require('gulp-browserify'),
    stringify = require('stringify'),
    uglify = require('gulp-uglify'),
    ngAnnotate = require('gulp-ng-annotate'),
    minify = require('gulp-minify'),
    notify = require('gulp-notify'),
    plumber = require('gulp-plumber'),
    browserSync = require('browser-sync'),

    options = {
        env: process.env.NODE_ENV || 'development',
        outputClientDir: process.env.OUTPUT_DIR || 'dist/',
        sass: process.env.sass || 'src/styles/sass/app.scss',
        js: process.env.js || 'src/scripts/app/app.js',
        libCss: [
            'bower_components/bootstrap/dist/css/bootstrap.css',
            'bower_components/bootstrap/dist/css/bootstrap-theme.css',
            'bower_components/fontawesome/css/font-awesome.css',
            'bower_components/jquery-ui/themes/ui-lightness/jquery-ui.css',
            'bower_components/jquery-ui/themes/base/autocomplete.css'
        ],
        libJs: [
            'bower_components/jquery/dist/jquery.js',
            'bower_components/jquery-ui/jquery-ui.js',
            'bower_components/bootstrap/dist/js/bootstrap.js',
            'bower_components/jquery-ui/jquery-ui.js',
            'bower_components/jquery-ui/ui/autocomplete.js'
        ]
    },
    bowerPath = 'bower_components/';
var onError = function(err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Beep"
    })(err);

    this.emit('end');
};

gulp.task('clean', function () {
  del.sync(['dist/**']);
});

gulp.task('server',function () {
  browserSync({
    server: {
     baseDir: './dist' 
    }
  });
});


gulp.task('vendorCss', function() {
    return gulp.src(options.libCss)
        .pipe(cssmin())
        .pipe(concat('lib.min.css'))
        .pipe(gulp.dest(options.outputClientDir + '/css'));
});
gulp.task('copy', function () {
    return gulp.src(['src/views/**/*.*'], {
        base: 'src/views/'
    }).pipe(gulp.dest('dist'));
});
gulp.task('fontawesomeFonts',function () {
  return gulp.src([
          bowerPath+'fontawesome/fonts/*.*'])
  .pipe(gulp.dest('dist/fonts/'));
});
gulp.task('sass', function() {
    var config = {};
    return gulp.src(options.sass)
        .pipe(sass(config))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.outputClientDir + '/css'));
});
gulp.task('js', function() {
    return gulp.src(options.js, {
            read: false
        })
        .pipe(plumber({
            errorHandler: onError
        }))
        .pipe(ngAnnotate())
        .pipe(browserify({
            transform: stringify({
                extensions: ['.html', '.tpl'],
                minify: true
            })
        }))
        .pipe(minify({
            ignoreFiles: ['.combo.js', '-min.js']
        }))
        .pipe(gulpIf(options.env !== 'development', uglify()))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(options.outputClientDir + '/js'))
        .pipe(notify({
            title: 'Gulp',
            subtitle: 'success',
            message: 'Js task finished',
            sound: "Pop"
        }));

});
gulp.task('vendor', function() {
    return gulp.src(options.libJs)
        .pipe(uglify())
        .pipe(concat('lib.min.js'))
        .pipe(gulp.dest(options.outputClientDir + '/js'));
});

gulp.task('watch', function() {
    gulp.watch('src/scripts/app/**/*.js', ['js']);
    gulp.watch('src/views/**/*.html', ['copy']);
    gulp.watch(options.libJs, ['vendor']);
    gulp.watch(['src/styles/sass/**/*.scss'], ['sass']);
    gulp.watch(options.libCss, ['vendorCss']);
});

gulp.task('serve',['clean','build','server'],function () {
  return gulp.watch([
    './src/**/*.*'
  ], [
   'build', browserSync.reload
  ]);
});

gulp.task('build', ['sass', 'js', 'copy', 'vendor', 'vendorCss', 'fontawesomeFonts']);
gulp.task('default', ['build', 'watch']);