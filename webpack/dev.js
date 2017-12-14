const webpack = require('webpack');


module.exports = {
    devtool: 'eval-source-map',
    plugins: [
        new webpack.DefinePlugin({
            ENV_PRODUCTION: JSON.stringify(false),
            ENV_API_BASE_URL: JSON.stringify('localhost:8081')
        })
    ]
};
