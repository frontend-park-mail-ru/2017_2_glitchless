const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = merge([
    {
        entry: './test/lib/index.js',
        plugins: [
            new HtmlWebpackPlugin({
                template: 'test/lib/index.html'
            })
        ]
    },
    require('./webpack/common'),
    require('./webpack/dev'),
    require('./webpack/watch')
]);
