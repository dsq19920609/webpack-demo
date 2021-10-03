import { treeshakingFunc } from './test';
import './theme.less';

// const divE = document.createElement('div');
// divE.classList.add('box');

// divE.addEventListener('click', () => {
//   // import按需加载
//   import('./test').then(({ alert }) => {
//     alert();
//   });
// });

treeshakingFunc();

// document.body.appendChild(divE);