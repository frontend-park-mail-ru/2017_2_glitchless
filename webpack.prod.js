const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ZopfliPlugin = require('zopfli-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    plugins: [
        new webpack.DefinePlugin({
            ENV_PRODUCTION: JSON.stringify(true)
        }),
        new UglifyJsPlugin(),
        new ZopfliPlugin(),
    ]
});