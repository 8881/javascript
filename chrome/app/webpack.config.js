'use strict';

var webpack = require('webpack');
var path = require('path');


module.exports = {
    entry: {
        app: './src/app.js'
    },
    output: {
        path: __dirname,
        filename: 'dist/[name].js'
    },
    module: {}
};