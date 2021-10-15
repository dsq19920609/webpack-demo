const { validate } = require('schema-utils');
const schema = require('./schema.json');
const globby = require('globby');
const path = require('path');
const fs = require('fs');
const util = require('util');
const webpack = require('webpack');

const { RawSource } = webpack.sources;

const readFilePromise = util.promisify(fs.readFile);

class CopyPlugin {
  constructor(options = {}) {
    // 验证参数
    validate(options, schema, {
      name: "copy-plugin"
    });
    // 校验没问题赋值给this
    this.options = options;
  }

  apply(compiler) {
    // 初始化compilation
    compiler.hooks.thisCompilation.tap('copy-plugin', (compilation) => {
      compilation.hooks.additionalAssets.tapAsync('copy-plugin', async (callback) => {
        let { from, to = '.', ignore } = this.options;
        // 1、读取from的文件
        // webpack配置的context配置项
        const context = compiler.options.context;
        // 输入路径变成绝对路径
        const absFrom = path.isAbsolute(from) ? from : path.resolve(from);
    
        // 2、过滤ignore的文件
        // globby(要处理的文件夹，options)
        const paths = await globby(absFrom, { ignore })

        // 3、读取paths，输出webpack格式的资源
        const files = Promise.all(paths.map(async (filepath) => {
          const data = await readFilePromise(filepath);

          // 构建绝对路径
          const relativePath = fs.basename(path);
          const filename = path.join(to, relativePath);

          return {
            data, // 文件内容
            filename // 文件名称
          }
        }));
        const assets = files.map(file => {
          const source = new RawSource(file.data);
          return {
            source,
            file: file.filename
          }
        });
        // 4、添加到compilation中，输出
        assets.forEach(asset => {
          compilation.emitAsset(asset.filename, asset.source);
        });

        callback();

      });
    });
  }
}

module.exports = CopyPlugin;