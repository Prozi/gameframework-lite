'use strict';

require('babel-polyfill');

const path = require('path');
const webpack = require('webpack');

let plugins = [
  new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      sourceMap: false
  })
];

let entries = {};
['view', 'example/game', 'example/testserver'].forEach((file) => {
  entries[file] = ['babel-polyfill', path.join(__dirname, `${file}.js`)]
});

if (!process.env.PRODUCTION) {
  plugins = [];
}

module.exports = {
  entry: entries,
  output: {
    filename: 'dist/[name].js'
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
  plugins,
};
