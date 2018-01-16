const webpack = require("webpack");
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    publicPath: '/dist/',
    output: {
        path: __dirname+'/dist',
        filename: '[name].js',
        publicPath: '/'
    },
    target: 'web',
    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(),
        new UglifyJSPlugin({ output: {comments: false} }),
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.html$/,
            threshold: 10240,
            minRatio: 0.8
        }),
        new ExtractTextPlugin("[name].css"),
        new HtmlWebpackPlugin({
            template: './index.html'
        })
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: "webpack-strip?strip[]=debug,strip[]=console.log,strip[]=console.info"
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
            },

        ]
    }
};