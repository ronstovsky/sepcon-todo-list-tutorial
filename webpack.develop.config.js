const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    publicPath: '/',
    output: {
        path: '/',
        publicPath: '/',
        filename: '[name].js',
    },
    devtool: 'source-map',

    module: {
        loaders: [
            {
                test: /\.scss$/,
                loaders: ["style-loader?sourceMap", "css-loader?sourceMap", "sass-loader?sourceMap"]
            },
        ],
    },

    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            filename: '/index.html',
            template: './index.html'
        })
    ],
};