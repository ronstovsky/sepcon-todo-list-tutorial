"use strict"

const path = require("path");
const env = process.env.WEBPACK_ENV;

let config = {};
if (env === 'dev') {
    config = require('./webpack.develop.config');
}
else if (env === 'prod') {
    config = require('./webpack.production.config');
}
if (env) {
    config.resolve = {
        alias: {
            app: path.resolve(__dirname, 'app'),
            config: path.resolve(__dirname, 'app/config.'+env)
        }
    }
    config.entry = {
        app: ['./app/index.js']
    };

    if (!config.plugins) {
        config.plugins = [];
    }

    let globalModule = {
        preLoaders: [
            {
                test: /\.js$/, // include .js files
                exclude: /(node_modules|sepcon)/, // exclude any and all files in the node_modules folder
                loader: "jshint-loader"
            }
        ],
        loaders: [
            {
                test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'url-loader?limit=10000&mimetype=application/font-woff'
            },
            {
                test: /\.(ttf|eot|svg|jpg|jpeg|png)(\?v=[a-zA-Z0-9]\.[a-zA-Z0-9]\.[a-zA-Z0-9])?$/,
                loader: 'file-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|vendors)/, // exclude any and all files in the node_modules folder
                loader: 'babel-loader'
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            }
        ]
    };
    if (config.module) {
        if (config.module.loaders) {
            config.module.loaders = config.module.loaders.concat(globalModule.loaders);
        }
        else {
            config.module.loaders = globalModule.loaders;
        }
        if (config.module.preLoaders) {
            config.module.preLoaders = config.module.preLoaders.concat(globalModule.preLoaders);
        }
        else {
            config.module.preLoaders = globalModule.preLoaders;
        }
    }
    else {
        config.module = globalModule;
    }
}
else {
    config = {
        entry: {
            app: __dirname + '/dist/app.js'
        },
        output: {
            path: __dirname + '/dist',
            publicPath: __dirname + '/images'
        }
    };

}

config.devServer = {
    colors: true,
    hot: true,
    inline: true,
    progress: true,
    host: 'localhost',
    contentBase: env === 'dev' ? '' : path.resolve('dist'),
    port: env === 'dev' ? 3005 : 3006,
    historyApiFallback: {
        index: '/index.html'
    }
};

module.exports = config;