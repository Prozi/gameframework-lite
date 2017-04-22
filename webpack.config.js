'use strict';

const path = require('path');
const webpack = require('webpack');

const entries = {};

['index', 'view'].forEach((file) => {
  entries[file] = path.join(__dirname, 'es6', `${file}.js`);
});

['example/game', 'example/testserver'].forEach((file) => {
  entries[file] = path.join(__dirname, `${file}.js`);
});

module.exports = {
  target: 'web',
  entry: entries,
  output: {
    filename: 'es5/[name].js'
  },
  stats: {
    colors: true,
    modules: true,
    reasons: true,
    errorDetails: true
  },
  module: {
    loaders: [{
      test: /\.json$/, 
      loader: 'json-loader' 
    }, {
      test: /.js?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }]
  },
};
