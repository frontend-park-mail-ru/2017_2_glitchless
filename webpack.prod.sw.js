const merge = require('webpack-merge');


module.exports = merge([
    {
        entry: './src/sw-index.ts'
    },
    require('./webpack/common'),
    require('./webpack/prod'),
    require('./webpack/sw')
]);
