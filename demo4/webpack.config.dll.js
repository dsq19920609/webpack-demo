const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    react: ['react', 'react-dom'],
  },
  output: {
    filename: '[name].dll.[hash:6].js',
    path: path.resolve(__dirname, 'dist', 'dll'),
    library: '[name]_dll', // 暴露给外部使用
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_dll',
      path: path.resolve(__dirname, 'dist', 'dll', 'manifest.json')
    })
  ]
}
