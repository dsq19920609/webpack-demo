module.exports = function (content, map, meta) {
  
  console.log('loader2');
  const callback = this.async();
  setTimeout(() => {
    // 异步loader,callback调用后才继续执行其他loader
    callback(null, content);
  }, 2000);
}

