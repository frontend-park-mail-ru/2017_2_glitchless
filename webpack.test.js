const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const _ = require('lodash');

const mergeConfig = {
    customizeArray: (a, b, key) => {
        if (key === 'plugins') {
            return _.uniqBy([...b, ...a], (it) => it.constructor.name);
        }
    }
};

module.exports = merge(mergeConfig)(devConfig, {
    entry: {
        main: './test/lib/index.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'test/lib/index.html'
        }),
    ]
});
