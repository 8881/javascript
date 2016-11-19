/**
 * Created by gaojian08 on 16/8/22.
 */
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style-loader", "css-loader")
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            hash: false,
            inject: 'body'
        })
    ]
};
