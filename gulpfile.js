const gulp = require('gulp');
const webpack = require('webpack-stream');
const sass = require('gulp-sass');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const plumber = require('gulp-plumber');


// js

const webpackConfig = {
    devtool: 'source-map',
    output: {
        filename: 'app.js'
    }
};

gulp.task('js:build', () => {
    return gulp.src('src/index.js')
      .pipe(plumber())
      .pipe(webpack(webpackConfig))
      .pipe(gulp.dest('dist/'));
});

gulp.task('js:watch', () => {
    return gulp.src('src/index.js')
      .pipe(webpack(Object.assign({}, webpackConfig, {watch: true})))
      .pipe(gulp.dest('dist/'));
});


// css

gulp.task('css:build', () => {
    const p = gulp.src('src/index.scss');
    return cssPipe(p);
});

gulp.task('css:build-dev', () => {
    const p = gulp.src('src/index.scss')
      .pipe(plumber());
    return cssPipe(p);
});

const cssPipe = (p) => {
    return p
      .pipe(sourcemaps.init())
      .pipe(sass())
      .pipe(rename('app.css'))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist'));
};

gulp.task('css:watch', () => {
    return gulp.watch('src/index.scss', ['css:build-dev']);
});


// html

gulp.task('html:build', () => {
    return gulp.src('src/index.pug')
      .pipe(pug())
      .pipe(gulp.dest('dist/'));
});

gulp.task('html:build-dev', () => {
    return gulp.src('src/index.pug')
      .pipe(plumber())
      .pipe(pug())
      .pipe(gulp.dest('dist/'));
});

gulp.task('html:watch', () => {
    return gulp.watch('src/index.html', ['html:build-dev']);
});


// main

gulp.task('build', ['js:build', 'css:build', 'html:build']);
gulp.task('watch', ['js:watch', 'css:watch', 'html:watch']);

gulp.task('default', ['build']);