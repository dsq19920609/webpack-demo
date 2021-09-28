#### 1、静态资源文件拷贝

copy-webpack-plugin 

https://webpack.docschina.org/plugins/copy-webpack-plugin/

将单个文件或整个目录复制到构建目录。

将 src/assets/font  拷贝到 dist/assets/font

这里只是做一下拷贝


#### 2、css单独提取和兼容，压缩

mini-css-webpack-plugin 

https://github.com/webpack-contrib/mini-css-extract-plugin

cssnano: 压缩

autoprefixer: 根据browserslist给css添加兼容前缀

另一种压缩css的方法: optimize-css-assets-webpack-plugin: 压缩css

* 开发环境：style-loader内联样式，更新速度更快，便于调试

* 生产环境：样式单独打包便于浏览器文件并行加载，同时可以做缓存

~~~js
// postcss.config.js
module.exports = {
  plugins: [
    require('autoprefixer'), // 根据browserslist做样式兼容
    require('cssnano')  // 样式压缩
  ]
}
~~~

~~~js
// plugin
new MiniCssExtractPlugin({
  filename: 'css/[name].[hash:8].css', // 开发环境用hash，生产环境用contenthash
  chunkFilename: 'css/[id].css' // 非入口的css打包后的名称
}),

// loader
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
}
~~~

~~~js
// webpack.config.js
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  optimization: {
    minimizer: [
      new OptimizeCssAssetsWebpackPlugin() // 推荐的配置方式
    ]
  },
  plugins: [
    // new OptimizeCssAssetsWebpackPlugin()  // 也可以使用的配置方式
  ]
}
~~~

另外一种

#### 3、动态导入 import

`import()` 语法，需要 `@babel/plugin-syntax-dynamic-import` 的插件支持，但是因为当前 `@babel/preset-env` 预设中已经包含了 `@babel/plugin-syntax-dynamic-import`，因此我们不需要再单独安装和配置。


可以在`output`配置项中配置`chunkFilename: isProd ? 'js/[id].[contenthash:8].js' : 'js/[id].[hash:8].js'`来配置动态导入的文件的打包输出格式

如果没有配置`chunkFilename`则会使用`filename`的格式输出。

~~~js
import './theme.less';

const divE = document.createElement('div');
divE.classList.add('box');

divE.addEventListener('click', () => {
  // import按需加载
  import('./test').then(({ alert }) => {
    alert();
  });
});

document.body.appendChild(divE);
~~~

#### 4、开启模块热更新

如果不开启，每次js代码修改，页面都会刷新

在页面上可以看到效果，没加热更新前，修改代码，动画会刷新从头开始执行，但是热更新后，动画不会刷新，而是继续执行

* devServer的hot 设置为true

* new webpack.HotModuleReplacementPlugin() //热更新插件

* 在入口文件中新增:

~~~js
// 入口文件：开启代码热更新, 只用于开发环境
if (process.env.NODE_ENV === 'development') {
  if(module && module.hot) {
    module.hot.accept()
  }  
}
~~~

#### 5、resolve配置

resolve 配置 webpack 如何寻找模块所对应的文件

~~~js
 resolve: {
    alias: {  // 别名配置
      '@/src': path.resolve(__dirname, 'src')
    },
    modules: [path.join(__dirname, 'node_modules')],  // 配置去那些目录下寻找第三方模块
    extensions: ['.js', '.jsx', '.ts', '.tsx'], // 解析的扩展名
    enforceExtension: false,  // 如果配置了为true，则导入时不能省略文件后缀
    mainFields: ['main', 'browser'], // 用于指定加载第三方模块时，入口文件从package.json的那个字段找, 一般为main
  },
~~~

#### 6、多环境配置

webpack-merge： 合并配置文件

`webpack.base.config.js: 公共配置`

`webpack.dev.config.js: 开发环境配置`

`webpack.prod.config.js: 生产环境配置`

`webpack.config.js`

~~~js
const merge = require('weback-merge');
const baseConfig = require('./webpack.base.config.js');
const devConfig = require('./webpack.dev.config.js');
const prodConfig = require('./webpack.prod.config.js');

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

module.export = merge(baseConfig, config);
~~~

#### 7、webpack-dev-server配置接口代理

~~~js
devServer: {
  proxy: {
    '/api': {
      target: 'http://localhost:4000',
      pathRewrite: {
          '/api': ''
      }
    }
  }
}
~~~