### 优化

`webpack-bundle-analyzer`： 用户对打包后的文件大小和依赖关系进行分析

https://www.npmjs.com/package/speed-measure-webpack-plugin

`speed-measure-webpack-plugin`: 测量各个插件和loader所花费的时间

所以优化的第一原则就是：能减少loader和plugin的使用就减少，毕竟每个都需要消耗时间。

~~~js
//webpack.config.js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin({});

const config = {
    //...webpack配置
}

module.exports = smp.wrap(config);
~~~

从下面的耗时分析来看, 比较耗时的有: `TerserPlugin 代码压缩`、`css的处理loader`、`js转换的babel-loader`
~~~js
// speed-measure-webpack-plugin 对各个loader和plugin的处理时间的分析
SMP  ⏱
General output time took 3.65 secs

 SMP  ⏱  Plugins
TerserPlugin took 0.99 secs
HtmlWebpackPlugin took 0.325 secs
CopyPlugin took 0.02 secs
MiniCssExtractPlugin took 0.002 secs
HotModuleReplacementPlugin took 0.002 secs

 SMP  ⏱  Loaders
css-loader, and
postcss-loader, and
less-loader took 1.15 secs
  module count = 1
babel-loader took 0.956 secs
  module count = 2
html-webpack-plugin, and
html-withimg-loader took 0.333 secs
  module count = 1
modules with no loaders took 0.04 secs
  module count = 10
url-loader took 0.035 secs
  module count = 1
style-loader, and
css-loader, and
postcss-loader, and
less-loader took 0.01 secs
  module count = 1
~~~


<br/>

#### 1、include/exclude

对于loader，尽量每个规则都使用include, 比如上面`3.65s`,当使用了include后，打包时间缩短为`3s`左右

#### 2、resolve

可以配置：`modules`, `extensions` 减少文件的搜寻范围，同时将匹配概率越大的放在前面。

#### 3、noParse

https://zhuanlan.zhihu.com/p/55682789

过滤不需要解析的文件

`RegExp [RegExp] function(resource) string [string]`

如果一些第三方模块没有AMD/CommonJS规范版本，可以使用 noParse 来标识这个模块，这样 Webpack 会引入这些模块，但是不进行转化和解析，从而提升 Webpack 的构建性能 ，例如：jquery 、lodash。

~~~js
//webpack.config.js
module.exports = {
  module: {
      noParse: /jquery|lodash/
  }
}
~~~

#### 4、externals

对于一些库构建可以将externals中的包，作为`peerDependencies`, 这样打包时候既不解析，也不打包

我们可以将一些JS文件存储在 CDN 上(减少 Webpack打包出来的 js 体积)，在 index.html 中通过 <script> 标签引入，如:

我们希望在使用时，仍然可以通过 import 的方式去引用(如 import $ from 'jquery')，并且希望 webpack 不会对其进行打包，此时就可以配置 externals。


~~~js
//webpack.config.js
module.exports = {
  externals: {
    //jquery通过script引入之后，全局中即有了 jQuery 变量
    'jquery': 'jQuery'
  }
}
~~~

#### 5、cacheDirectory或cache-loader

给babel-loader开启`cacheDirectory`或者使用`cache-loader`

`loader: 'babel-loader?cacheDirectory'`

两者的打包区别：1、cache-loader 第一次打包比较慢，变为`4s`(比较新增一个loader处理，第一次肯定要增加时间), 但是后面打包耗时变为`2.4s`

2、cacheDirectory 第一次打包较cache-loader快，但是后面再打包耗时为`2.8s`左右

看起来`cache-loader`更好用些

~~~js
{ 
  test: /\.js$/,
  include: path.resolve(__dirname, './src'),
  use: [
    'cache-loader',
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
~~~

#### 6、happyPack

`yarn add happypack --dev`

HappyPack 把任务分解给多个子进程去并发的执行，子进程处理完后再把结果发送给主进程。

`当项目不是很复杂时，不需要配置 happypack，因为进程的分配和管理也需要时间，并不能有效提升构建速度，甚至会变慢。`

happypack 默认开启 `CPU核数 - 1` 个进程, 可以通过`threads`配置要使用的线程数。

~~~js
const Happypack = require('happypack');
module.exports = {
    //...
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                use: 'Happypack/loader?id=js',
                include: [path.resolve(__dirname, 'src')]
            },
            {
                test: /\.css$/,
                use: 'Happypack/loader?id=css',
                include: path.resolve(__dirname, 'src')
            }
        ]
    },
    plugins: [
        new Happypack({
            id: 'js', //和rule中的id=js对应
            //将之前 rule 中的 loader 在此配置
            use: ['babel-loader'] //必须是数组
        }),
        new Happypack({
            id: 'css',//和rule中的id=css对应
            use: ['style-loader', 'css-loader','postcss-loader'],
        })
    ]
}
~~~

#### 7、thread-loader

`yarn add thread-loader --dev`

与Happypack类似，把 thread-loader 放置在其它 loader 之前，那么放置在这个 loader 之后的 loader 就会在一个单独的 worker 池中运行

~~~js
module.exports = {
    module: {
        // 配置 thread-loader, 放在其他loader前
        rules: [
            {
                test: /\.jsx?$/,
                use: ['thread-loader', 'cache-loader', 'babel-loader']
            }
        ]
    }
}
~~~

#### 8、开启js多进程压缩

`yarn add terser-webpack-plugin --dev`

~~~js
// webpack.config.js
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
  ]
},
~~~

#### 9、hard-source-webpack-plugin

HardSourceWebpackPlugin 为模块提供中间缓存

https://www.npmjs.com/package/hard-source-webpack-plugin

~~~js
//webpack.config.js
var HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
module.exports = {
  plugins: [
    new HardSourceWebpackPlugin()
  ]
}
~~~

#### 10、DllPlugin

DllPlugin和DllReferencePlugin是webpack内置的模块，可以用来拆分bundle, 并且可大大提高构建速度

DllPlugin将不频繁更新的库进行编译，当这些依赖没有变化时，就不需要重新编译

创建`webpack.config.dll.js`专门用来编译动态链接库，将react, react-dom 单独打包成一个动态链接库

首先执行`yarn dll`然后执行`yarn build`, 然后将`react.dll.xxx.js`手动引入

#### 11、splitChunks 抽离公共代码

optimization.splitChunks


如果多个页面引入了一些公共模块，那么可以把这些公共的模块抽离出来，单独打包。公共代码只需要下载一次就缓存起来了，避免了重复下载

~~~js
//webpack.config.js
module.exports = {
    optimization: {
        splitChunks: {//分割代码块
            cacheGroups: {
                vendor: {
                    //第三方依赖
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
                    minSize: 100, //大小超过100个字节
                    minChunks: 3 //最少引入了3次
                }
            }
        }
    }
}
~~~

#### 12、同时使用dll和splitChunks

可以将react、react-dom打包到动态链接库

将lodash 打包到vendor