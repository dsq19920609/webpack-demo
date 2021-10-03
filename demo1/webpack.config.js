const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  mode: isProd ? 'production': 'development',
  entry: {
    'main': './src/index.js'
  },
  devtool: !isProd ? false : 'eval-cheap-module-source-map',
  output: {
    filename: isProd ? 'js/[name].[contenthash:8].js' : 'js/[name].[hash:8].js',
    path: path.join(__dirname, 'dist'),
    publicPath: isProd ? '/': '/', // 生产环境可以直接配置成CDN的路径，这样html引入的js和css路径会添加CDN地址前缀
    clean: true, // webpack5  替代之前的clean-webpack-plugin
  },
  resolve: {
    alias: {
      '@/src': path.resolve(__dirname, 'src')
    },
    modules: [path.join(__dirname, 'node_modules'), path.join(__dirname, 'src')],
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      { 
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
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
              outputPath: 'assets', // 输出目录
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
    })
  ],
  devServer: {
    port: '3000', //默认是8080
    compress: true, //是否启用 gzip 压缩
    proxy: {},
    open: true,
    hot: true
  }
}