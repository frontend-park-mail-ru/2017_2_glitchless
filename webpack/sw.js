const glob = require('glob');
const path = require('path');
const webpack = require('webpack');

function findFilesToCache() {
    return glob.sync('./dist/**/*.*')
        .map((p) => p.slice('./dist'.length))
        .filter((p) => p !== '/sw.js');
}

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            ENV_SW_CACHE_NAME: JSON.stringify(new Date()),
            ENV_SW_ASSETS: JSON.stringify(findFilesToCache()),
        }),
    ],
    output: {
        filename: 'sw.js',
    },
};
