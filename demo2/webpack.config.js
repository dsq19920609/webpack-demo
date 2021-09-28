const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production': 'development',
  entry: {
    'main': './src/index.js'
  },
  devtool: isProd ? false : 'eval-cheap-module-source-map',
  output: {
    filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].[hash:8].js',
    path: path.join(__dirname, 'dist'),
    publicPath: isProd ? '/': '/', // 生产环境可以直接配置成CDN的路径，这样html引入的js和css路径会添加CDN地址前缀
    clean: true, // webpack5  替代之前的clean-webpack-plugin
    chunkFilename: isProd ? 'js/[id].[contenthash:8].js' : 'js/[id].[hash:8].js' // 用于import动态导入的js文件
  },
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, 'src')
    },
    modules: [path.join(__dirname, 'node_modules')], // 去哪找第三方模块
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    mainFileds: ['main', 'browser'] // 用于指定加载第三方模块时，入口文件从package.json的那个字段找, 一般为main
  },
  module: {
    rules: [
      { 
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { // babel的配置可以写到配置文件babel.config.js文件中
              presets: ['@babel/preset-env'],
              plugins: [
                [ "@babel/plugin-transform-runtime", {
                    "corejs": 3
                  }
                ]
              ]
            }
          }
        ]
      },
      {
        test: /.less$/,
        exclude: /node_modules/,
        use: [
          { // 开发环境：style-loader内联样式，速度更快 生产环境：样式单独打包便于浏览器文件并行加载
            loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader', 
            options: isProd ?  {} : {}
          },
          'css-loader',
          'postcss-loader',
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240, // 小于10kb的图片以base64的格式内联到样式中
              name: '[name].[hash:8].[ext]', // 输出后图片名称
              outputPath: 'assets/images', // 输出目录
              esModule:false // 注意将esModule:false, 否则打包会异常
            }
          }
        ],
        type: 'javascript/auto', // webpack5的静态资源解决方案
        exclude: /node_modules/
      },
      // {  // webpack5的静态资源处理方案
      //   test: /\.(png|jpg)$/,
      //   type: 'asset/resource',
      //   generator: {
      //     filename: 'asserts/[name].[hash:8][ext]'
      //   },
      //   exclude: /node_modules/
      // }
      { // 处理html中图片，后面会交给url-loader处理
        test: /.html$/,
        use: 'html-withimg-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash:8].css', // 开发环境用hash，生产环境用contenthash
      chunkFilename: 'css/[id].css' // 非入口的css打包后的名称
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/index.html'),
      minify: {
        collapseWhitespace: true,
        removeComments: true
      }
    }),
    new CopyWebpackPlugin({
      patterns: [ // 可以配置多个拷贝任务
        {
          from: 'src/assets/font/',
          to: path.resolve(__dirname, 'dist/assets/font/')
        }
      ]
    }),
    new webpack.HotModuleReplacementPlugin() //热更新插件
  ],
  devServer: {
    port: '3000', //默认是8080
    compress: true, //是否启用 gzip 压缩
    proxy: {},
    open: true,
    hot: true
  }
}