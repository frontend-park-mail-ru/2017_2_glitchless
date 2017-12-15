const merge = require('webpack-merge');


module.exports = merge([
    {
        entry: './src/sw-index.ts'
    },
    require('./webpack/common'),
    require('./webpack/dev'),
    require('./webpack/sw')
]);
