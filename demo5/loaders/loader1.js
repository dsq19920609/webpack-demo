const { getOptions } = require('loader-utils');
const { validate } = require('schema-utils');
const schema = require('./schema.json');
const babel = require('@babel/core');
const util = require('util');

// 将普通的回调异步方法 转换成基于 promise的异步方法
const transform = util.promisify(babel.transform);

module.exports = function (content, map, meta) {
  // 1、获取参数
  const options = getOptions(this) || {};
  
  // 2、校验参数是否合法
  validate(schema, options, {
    name: 'babel-loader'
  });

  // 3、创建异步loader
  const callback = this.async();

  // 4、babel编译
  transform(content, options).then(({ code, map }) => {
    callback(null, code);
  }).catch(e => callback(e));
}

