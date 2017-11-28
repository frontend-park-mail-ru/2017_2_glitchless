const gulp = require('gulp');
const webpack = require('webpack-stream');
const runSequence = require('run-sequence');
const del = require('del');
const gulpPlumber = require('gulp-plumber');


// js

const webpackDevConfig = require('./webpack.dev.js');
const webpackProdConfig = require('./webpack.prod.js');

gulp.task('js:build-dev', () => {
    return gulp.src('src/index.ts')
        .pipe(gulpPlumber())
        .pipe(webpack(Object.assign({}, webpackDevConfig, {output: {filename: 'app.js'}})))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js:build-prod', () => {
    return gulp.src('src/index.ts')
        .pipe(webpack(Object.assign({}, webpackProdConfig, {output: {filename: 'app.js'}})))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sw-js:build-dev', () => {
    return gulp.src('src/sw-index.ts')
        .pipe(gulpPlumber())
        .pipe(webpack(Object.assign({}, webpackDevConfig, {output: {filename: 'sw.js'}})))
        .pipe(gulp.dest('dist/'));
});

gulp.task('sw-js:build-prod', () => {
    return gulp.src('src/sw-index.ts')
        .pipe(webpack(Object.assign({}, webpackProdConfig, {output: {filename: 'sw.js'}})))
        .pipe(gulp.dest('dist/'));
});


// test

const webpackTestConfig = {
    devtool: 'source-map',
    output: {
        filename: 'test.js'
    },
    watch: true
};

gulp.task('test-js:watch', () => {
    return gulp.src('test/lib/index.ts')
        .pipe(gulpPlumber())
        .pipe(webpack(webpackTestConfig))
        .pipe(gulp.dest('dist/'));
});

gulp.task('test-html:build-dev', () => {
    return gulp.src('test/lib/**/*.{html,css}')
        .pipe(gulp.dest('dist/'));
});

gulp.task('test-html:watch', () => {
    return gulp.watch('test/lib/**/*.{html,css}', ['test-html:build-dev']);
});


// utility

gulp.task('clean', () => del(['dist']));


// main

gulp.task('build', (cb) => runSequence('clean', ['js:build-prod', 'sw-js:build-prod'], cb));
gulp.task('watch', (cb) => runSequence('clean', ['js:build-dev'], cb));

gulp.task('test', ['test-js:watch', 'test-html:watch', 'test-html:build-dev']);

gulp.task('default', ['build']);