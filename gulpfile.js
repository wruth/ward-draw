// Gulp Dependencies
var gulp = require('gulp'),
    rename = require('gulp-rename'),

// Build Dependencies
    browserify = require('gulp-browserify'),

// Test Dependencies
    mochaPhantomjs = require('gulp-mocha-phantomjs');


// Browserify
gulp.task('browserify-src', function () {
    return gulp.src('source/js/index.js')
        .pipe(browserify({
            insertGlobals: true
        }))
        .pipe(rename('script.js'))
        .pipe(gulp.dest('build'))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('browserify-test', function () {
    return gulp.src('test/index.js')
        .pipe(browserify({
            insertGlobals: true
        }))
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
    return gulp.src('source/index.html')
        .pipe(gulp.dest('dist'));
});

// Test

//gulp.task('test', ['browserify-test'], function () {
//    return gulp.src('test/index.html')
//        .pipe(mochaPhantomjs());
//});

// Tasks

gulp.task('default', [/*'test', */'browserify-src', 'copy']);
