const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/ui/index.html',
            inject: 'head',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            },
        })
    ]
};