const merge = require('webpack-merge');

module.exports = [
    merge([
        {
            entry: {
                main: './src/index.ts',
            },
        },
        require('./webpack/common'),
        require('./webpack/dev'),
        require('./webpack/kotlin'),
        require('./webpack/html'),
        require('./webpack/clean'),
    ]),
    merge([
        {
            entry: {
                main: './src/sw-cleaner-index.ts',
            },
        },
        require('./webpack/common'),
        require('./webpack/dev'),
        require('./webpack/sw'),
    ]),
];
