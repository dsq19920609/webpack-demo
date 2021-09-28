import './theme.less';

// 入口文件：开启代码热更新, 只用于开发环境
if (process.env.NODE_ENV === 'development') {
  if(module && module.hot) {
    module.hot.accept()
  }  
}

const divE = document.createElement('div');
divE.classList.add('box');

divE.addEventListener('click', () => {
  // import按需加载
  import('./test').then(({ alert }) => {
    alert();
  });
});

document.body.appendChild(divE);