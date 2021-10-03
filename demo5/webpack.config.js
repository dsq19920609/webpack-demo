const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    'main': './src/main.js'
  },
  output: {
    filename: '[name].[chunkhash:6].js',
    path: path.resolve(__dirname, './dist')
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}