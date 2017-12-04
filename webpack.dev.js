const merge = require('webpack-merge');


module.exports = [
    merge([
        {
            entry: './src/index.ts'
        },
        require('./webpack/common'),
        require('./webpack/dev'),
        require('./webpack/html'),
        require('./webpack/clean')
    ]),
    merge([
        {
            entry: './src/sw-cleaner-index.ts'
        },
        require('./webpack/common'),
        require('./webpack/dev'),
        require('./webpack/sw')
    ]),
];
