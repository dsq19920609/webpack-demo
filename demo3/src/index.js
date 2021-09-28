import React from 'react';
import ReactDOM from 'react-dom';
import { treeshakingFunc } from './test';
import App from './app';

treeshakingFunc();

// 入口文件：开启代码热更新, 只用于开发环境
if (process.env.NODE_ENV === 'development') {
  if(module && module.hot) {
    module.hot.accept()
  }  
}

ReactDOM.render(<App/>, document.getElementById('root'))
