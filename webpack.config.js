'use strict';

const path = require('path');
const webpack = require('webpack');

const entries = {};

['example/game', 'example/testserver'].forEach((file) => {
  entries[file.split('/')[1]] = path.join(__dirname, `${file}.js`);
});

module.exports = {
  target: 'web',
  entry: entries,
  output: {
    filename: 'example/js/[name].js'
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
