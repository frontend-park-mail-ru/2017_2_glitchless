const path = require('path');
const webpack = require('webpack');


module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
                test: /\.pug$/,
                use: 'pug-loader'
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')(),
                                require('cssnano')()
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                    }
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            outputPath: 'images/'
                        }
                    },
                    {
                        loader: 'image-webpack-loader'
                    }
                ]
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.ts', '.scss', '.png', '.jpg']
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin()
    ],
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].[chunkhash].js'
    }
};