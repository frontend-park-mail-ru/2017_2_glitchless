const webpack = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = merge(commonConfig, {
    devtool: 'eval-source-map',
    watch: true,
    plugins: [
        new webpack.DefinePlugin({
            ENV_PRODUCTION: JSON.stringify(false)
        })
    ]
});