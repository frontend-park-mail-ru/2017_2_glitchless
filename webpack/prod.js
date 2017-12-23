const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ZopfliPlugin = require('zopfli-webpack-plugin');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            ENV_PRODUCTION: JSON.stringify(true),
            ENV_API_BASE_URL: JSON.stringify('https://glitchless.ru/api'),
            ENV_API_WS_URL: JSON.stringify('wss://glitchless.ru/game'),
        }),
        new UglifyJsPlugin(),
        new ZopfliPlugin(),
    ],
};
