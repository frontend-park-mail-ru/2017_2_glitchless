const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    plugins: [
        new CleanWebpackPlugin(['dist'], {root: path.resolve(__dirname, '..')}),
    ],
};
