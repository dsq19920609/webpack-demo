const { getOptions } = require('loader-utils');
const css = require('css');


module.exports = function(content, map, meta) {
  const options = getOptions(this);
  console.log(JSON.stringify(css.parse(content)))
  return content;
}