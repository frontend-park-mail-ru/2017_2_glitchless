const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ZopfliPlugin = require('zopfli-webpack-plugin');


module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            ENV_PRODUCTION: JSON.stringify(true),
            ENV_API_BASE_URL: JSON.stringify('https://api.glitchless.ru/'),
            ENV_API_WS_URL: JSON.stringify('ws://api.glitchless.ru/')
        }),
        new UglifyJsPlugin(),
        new ZopfliPlugin()
    ]
};