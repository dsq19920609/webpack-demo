### 优化

`webpack-bundle-analyzer`： 用户对打包后的代码分析

https://www.npmjs.com/package/speed-measure-webpack-plugin

`speed-measure-webpack-plugin`: 测量各个插件和loader所花费的时间

所以优化的第一原则就是：能减少loader和plugin的使用就减少，毕竟每个都需要消耗时间。


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