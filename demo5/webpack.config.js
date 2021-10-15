const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const path = require('path');

// const MyPlugin = require('./plugins/MyPlugin');

module.exports = {
  mode: 'development',
  entry: {
    'main': './src/main.js'
  },
  context: path.resolve(__dirname),
  output: {
    filename: '[name].[hash:6].js',
    path: path.resolve(__dirname, './dist'),
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, 'loaders'), 'node_modules']
  },
  module:{
    rules: [
      {
        test: /\.js/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {}
          },
          'css-loader',
          {
            loader: 'pxtorem-loader',
            options: {
              
            }
          }
        ]
      }
    ]
  },
  // optimization: {
  //   runtimeChunk: true
  // },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlPlugin(),
    // new MyPlugin({ --【
    //   from: './public/',
    //   to: './dist/',
    //   ignore: ['./public/index.html']
    // })
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],
  devServer: {
    static: './dist',
    open: true,
    hot: true
  }
}