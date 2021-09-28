module.exports = {
  plugins: [
    require('autoprefixer'), // 根据browserslist做样式兼容
    require('cssnano')  // 样式压缩
  ]
}