const KotlinWebpackPlugin = require('@jetbrains/kotlin-webpack-plugin');
const path = require('path');

module.exports = {
    // entry: {
    //     kotlin: 'kotlinApp',
    // },
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, '../kotlin_build'),
                exclude: [
                    /kotlin\.js$/,
                ],
                use: ['source-map-loader'],
                enforce: 'pre',
            },
        ],
    },
    resolve: {
        modules: ['kotlin_build', 'node_modules'],
    },
    plugins: [
        new KotlinWebpackPlugin({
            src: path.resolve(__dirname, '../src-kotlin'),
            verbose: true,
            // optimize: true,
        }),
    ],
};
