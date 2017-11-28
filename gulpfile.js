const gulp = require('gulp');
const runSequence = require('run-sequence');
const del = require('del');

const gulpRename = require('gulp-rename');
const gulpSourcemaps = require('gulp-sourcemaps');
const gulpPlumber = require('gulp-plumber');
const gulpInsert = require('gulp-insert');
const gulpIf = require('gulp-if');

const webpack = require('webpack-stream');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ZopfliPlugin = require('zopfli-webpack-plugin');

const gulpSass = require('gulp-sass');
const gulpAutoprefixer = require('gulp-autoprefixer');
const gulpCleanCSS = require('gulp-clean-css');

const gulpHtmlmin = require('gulp-htmlmin');

const gulpZopfli = require('gulp-zopfli');
const gulpSize = require('gulp-size');


// js

const useStrictCode = `
    "use strict";
`;

const removeServiceWorkerCode = `
    navigator.serviceWorker.getRegistrations().then(function(registrations) {
        for (let registration of registrations) {
            registration.unregister();
        } 
    });
`;

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
    }
};

const jsPipe = (inputFilepath, outputFilename, {doWatch = false, doMinify = false, doRemoveServiceWorker = false} = {}) => {
    const configChanges = {};
    configChanges.output = {
        filename: outputFilename
    };
    configChanges.watch = doWatch;
    configChanges.plugins = [];
    if (doMinify) {
        configChanges.plugins.push(new UglifyJsPlugin({sourceMap: true}));
        configChanges.plugins.push(new ZopfliPlugin());
    }

    return gulp.src(inputFilepath)
        .pipe(webpack(Object.assign({}, webpackConfig, configChanges)))
        .pipe(gulpIf((file) => file.path.endsWith('.js'),
            gulpInsert.prepend(useStrictCode)))
        .pipe(gulpIf((file) => file.path.endsWith('.js') && doRemoveServiceWorker,
            gulpInsert.prepend(removeServiceWorkerCode)))
        .pipe(gulp.dest('dist/'));
};

gulp.task('js:build', () => {
    return jsPipe('src/index.ts', 'app.js', {doMinify: true});
});

gulp.task('js:watch', () => {
    return jsPipe('src/index.ts', 'app.js', {doWatch: true});
});

gulp.task('js:watch-dev', () => {
    return jsPipe('src/index.ts', 'app.js', {doWatch: true, doRemoveServiceWorker: true});
});

gulp.task('sw-js:build', () => {
    return jsPipe('src/sw-index.ts', 'sw.js', {doMinify: true});
});

gulp.task('sw-js:watch', () => {
    return jsPipe('src/sw-index.ts', 'sw.js', {doWatch: true});
});


// css

const cssPipe = (p, {doMinify = false} = {}) => {
    p = p
        .pipe(gulpSourcemaps.init())
        .pipe(gulpSass())
        .pipe(gulpAutoprefixer());
    if (doMinify) {
        p = p
            .pipe(gulpCleanCSS());
    }

    p = p
        .pipe(gulpRename('app.css'))
        .pipe(gulpSourcemaps.write('.'))
        .pipe(gulpSize({title: 'CSS', showFiles: true, showTotal: false}))
        .pipe(gulp.dest('dist'));

    if (doMinify) {
        p = p
            .pipe(gulpZopfli())
            .pipe(gulpSize({title: 'CSS gz', showFiles: true, showTotal: false}))
            .pipe(gulp.dest('dist'));
    }

    return p;
};

gulp.task('css:build', () => {
    const p = gulp.src('src/views/index.scss');
    return cssPipe(p, {doMinify: true});
});

gulp.task('css:build-dev', () => {
    const p = gulp.src('src/views/index.scss')
        .pipe(gulpPlumber());
    return cssPipe(p);
});

gulp.task('css:watch', () => {
    return gulp.watch('src/views/**/*.scss', ['css:build-dev']);
});


// html

gulp.task('html:build', () => {
    return gulp.src('src/views/index.html')
        .pipe(gulpHtmlmin({collapseWhitespace: true}))
        .pipe(gulpSize({title: 'HTML', showFiles: true, showTotal: false}))
        .pipe(gulp.dest('dist/'))
        .pipe(gulpZopfli())
        .pipe(gulpSize({title: 'HTML gz', showFiles: true, showTotal: false}))
        .pipe(gulp.dest('dist/'));
});


// images

gulp.task('images:build', () => {
    return gulp.src('src/**/*.{png,jpg,gif}')
        .pipe(gulpSize({title: 'Images'}))
        .pipe(gulp.dest('dist/'))
        .pipe(gulpZopfli())
        .pipe(gulpSize({title: 'Images gz'}))
        .pipe(gulp.dest('dist/'));
});

gulp.task('images:watch', () => {
    return gulp.watch('src/**/*.{png,jpg,gif}', ['images:build']);
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

gulp.task('clean', () => {
    return del(['dist']);
});


// main

gulp.task('build',
    (cb) => runSequence('clean', ['js:build', 'sw-js:build', 'css:build', 'html:build', 'images:build'], cb));
gulp.task('watch',
    (cb) => runSequence('clean', ['js:watch-dev', 'css:watch', 'css:build-dev', 'html:build', 'images:watch', 'images:build'], cb));

gulp.task('test',
    ['test-js:watch', 'test-html:watch', 'test-html:build-dev']);

gulp.task('default', ['build']);