const merge = require('webpack-merge');


module.exports = merge([
    {
        entry: './src/index.ts'
    },
    require('./webpack/common'),
    require('./webpack/prod'),
    require('./webpack/html'),
    require('./webpack/clean')
]);
