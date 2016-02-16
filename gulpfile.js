// Gulp Dependencies
var gulp = require('gulp'),
    rename = require('gulp-rename'),

// Build Dependencies
    gulpBrowserify = require('gulp-browserify'),

// Test Dependencies
    mocha = require('gulp-mocha'),
    babel = require('gulp-babel');

// Browserify
gulp.task('browserify-src', function () {
    return gulp.src('source/js/index.js')
        .pipe(gulpBrowserify({
            insertGlobals: true
        }))
        .pipe(rename('script.js'))
        .pipe(gulp.dest('build'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browserify-test', function () {
    return gulp.src('test/index.js')
       .pipe(gulpBrowserify({
           insertGlobals: true
       }))
       .pipe(babel())
       .pipe(rename('test.js'))
       .pipe(gulp.dest('build'));
});

// Copy
gulp.task('copy-html', function () {
    return gulp.src('source/index.html')
        .pipe(gulp.dest('dist'));
});

gulp.task('copy-css', function () {
    return gulp.src('source/css/main.css')
        .pipe(gulp.dest('dist/css'));
});

gulp.task('copy', ['copy-html', 'copy-css'], function () {
    console.log('copying');
});

// Build
gulp.task('build', ['browserify-src', 'copy'], function () {
    console.log('building');
});

// Test
gulp.task('test', ['browserify-test'], function () {
    return gulp.src('./build/test.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});

// Tasks

gulp.task('default', ['test', 'build']);
