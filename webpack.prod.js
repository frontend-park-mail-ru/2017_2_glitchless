const merge = require('webpack-merge');

module.exports = merge([
    {
        entry: {
            main: './src/index.ts',
        },
    },
    require('./webpack/common'),
    require('./webpack/prod'),
    require('./webpack/kotlin'),
    require('./webpack/html'),
    require('./webpack/clean'),
]);
