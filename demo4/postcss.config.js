const stylelint = require('stylelint');

module.exports = {
  "plugins": {
    'postcss-preset-env': {},
    'postcss-cssnext': {},
    // 'cssnano': {},
    // 'postcss-pxtorem': { // px -> rem
    //   rootValue: 50, // 根font-size: 50px;
    //   unitPrecision:2, //精度
    //   propList: ['*'] // 转换所有属性 propList: ['font-size', 'margin'] 只转换指定属性
    // }
  }
}