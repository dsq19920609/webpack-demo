const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const HappyPack = require('happypack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


const isProd = process.env.NODE_ENV === 'production';

// 打包速度分析
const smp = new SpeedMeasureWebpackPlugin({});

const config = {
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
    mainFields: ['main', 'browser'] // 用于指定加载第三方模块时，入口文件从package.json的那个字段找, 一般为main
  },
  module: {
    // noParse: /lodash/,
    rules: [
      { 
        test: /\.js$/,
        include: path.resolve(__dirname, './src'),
        use: [
          'cache-loader', // 缓存打包结果，减少loader的耗时
          {
            loader: 'babel-loader',
            options: { // babel的配置可以写到配置文件babel.config.js文件中
              presets: ['@babel/preset-env', '@babel/preset-react'],
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
        include: path.resolve(__dirname, './src'),
        use: [
          { // 开发环境：style-loader内联样式，速度更快 生产环境：样式单独打包便于浏览器文件并行加载
            loader: isProd ? MiniCssExtractPlugin.loader : 'style-loader', 
            options: isProd ?  {} : {}
          },
          {
            loader: 'css-loader',
            options: {  // 开启css modules
              modules: true
            }
          },
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
        include: path.resolve(__dirname, './src'),
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
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({ // 代码压缩
        extractComments: false,
        // 是否使用多线程进行编译 --- 默认值就是true
        // 可以设置为number，即手动指定设置多少进程进行打包
        // 也可以设置为true，此时parallel的值就是cpus.length - 1
        parallel: true,
        terserOptions: {
          // 在这里对terser进行手动配置
          // 在这里的配置会覆盖默认 terser 中的配置
        }
      })
    ],
    splitChunks: {//分割代码块
      cacheGroups: {
        lodash: {
          name: "lodash", // 单独将 lodash 拆包
          priority: 5, // 权重需大于`vendor`
          test: /lodash/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //重复引入了几次
        },
        vendor: {
          //第三方依赖 可以将react,react-dom 打包到verdor中
          priority: 1, //设置优先级，首先抽离第三方模块
          name: 'vendor',
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 1 //最少引入了1次
        },
        //缓存组
        common: {
          //公共模块
          chunks: 'initial',
          name: 'common',
          minSize: 0, //大小超过100个字节
          minChunks: 3 //最少引入了3次
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  // externals: ['react', 'react-dom', 'lodash'], // react、react-dom、lodash 一般开发库的时候作为peerDependencies
  plugins: [
    // new webpack.DllReferencePlugin({  // 动态链接库 可将react、react-dom打包
    //   manifest: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
    // }),
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
    new webpack.HotModuleReplacementPlugin(), //热更新插件
    // new BundleAnalyzerPlugin() // 项目构建的打包结果分析，可以看到每个文件里面包含的模块
  ],
  devServer: {
    port: '3000', //默认是8080
    compress: true, //是否启用 gzip 压缩
    proxy: {},
    open: true,
    hot: true
  }
}

// module.exports = smp.wrap(config);
module.exports = config;