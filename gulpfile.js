const gulp = require('gulp');
const path = require('path');
const webpack = require('webpack-stream');
const gulpSass = require('gulp-sass');
const gulpRename = require('gulp-rename');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpPlumber = require('gulp-plumber');
const gulpInsert = require('gulp-insert');
const gulpIf = require('gulp-if');


// js

const webpackConfig = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.pug$/,
                use: 'pug-loader'
            }
        ]
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'app.js'
    }
};

gulp.task('js:build', () => {
    return gulp.src('src/index.ts')
        .pipe(webpack(webpackConfig))
        .pipe(gulpIf((file) => file.path.endsWith('.js'), gulpInsert.prepend('"use strict";\n')))
        .pipe(gulp.dest('dist/'));
});

gulp.task('js:watch', () => {
    return gulp.src('src/index.ts')
        .pipe(webpack(Object.assign({}, webpackConfig, {watch: true})))
        .pipe(gulpIf((file) => file.path.endsWith('.js'), gulpInsert.prepend('"use strict";\n')))
        .pipe(gulp.dest('dist/'));
});


// css

gulp.task('css:build', () => {
    const p = gulp.src('src/views/index.scss');
    return cssPipe(p);
});

gulp.task('css:build-dev', () => {
    const p = gulp.src('src/views/index.scss')
        .pipe(gulpPlumber());
    return cssPipe(p);
});

const cssPipe = (p) => {
    return p
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass())
        .pipe(gulpRename('app.css'))
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
};

gulp.task('css:watch', () => {
    return gulp.watch('src/views/**/*.scss', ['css:build-dev']);
});


// html

gulp.task('html:build', () => {
    return gulp.src('src/views/index.html')
        .pipe(gulp.dest('dist/'));
});


// other files

gulp.task('other:build', () => {
    return gulp.src('src/**/*.{png,jpg,gif}')
        .pipe(gulp.dest('dist/'));
});

gulp.task('other:watch', () => {
    return gulp.watch('src/**/*.{png,jpg,gif}', ['other:build']);
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


// main

gulp.task('build', ['js:build', 'css:build', 'html:build', 'other:build']);
gulp.task('watch', ['js:watch', 'css:watch', 'css:build-dev', 'html:build', 'other:watch', 'other:build']);

gulp.task('test', ['test-js:watch', 'test-html:watch', 'test-html:build-dev']);

gulp.task('default', ['build']);