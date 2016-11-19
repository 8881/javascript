'use strict';

var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var postcssImport = require('postcss-easy-import');
var precss = require('precss');
var cssnext = require('postcss-cssnext');

module.exports = {
    entry: {
        index: './src/index.js',
        style: './src/style.css'
    },
    output: {
        path: 'dist',
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style', 'css!postcss')
            }
        ]
    },
    postcss: function processPostcss(webpack) {  // eslint-disable-line no-shadow
        return [
            postcssImport({
                addDependencyTo: webpack
            }),
            precss,
            cssnext
        ];
    },
    plugins: [
        new CleanPlugin('./dist'),
        new ExtractTextPlugin('[name].[chunkhash].css'),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            hash: false,
            inject: 'body',
            minify: {
                collapseWhitespace: false
            }
        })
    ]
};
