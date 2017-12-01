const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ZopfliPlugin = require('zopfli-webpack-plugin');

module.exports = merge(commonConfig, {
    plugins: [
        new webpack.DefinePlugin({
            ENV_PRODUCTION: JSON.stringify(true)
        }),
        new UglifyJsPlugin(),
        new ZopfliPlugin()
    ]
});