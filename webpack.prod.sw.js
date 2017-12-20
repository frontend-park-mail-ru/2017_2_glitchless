const merge = require('webpack-merge');

module.exports = merge([
    {
        entry: {
            main: './src/sw-index.ts',
        },
    },
    require('./webpack/common'),
    require('./webpack/prod'),
    require('./webpack/sw'),
]);
