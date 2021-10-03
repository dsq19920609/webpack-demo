import React from 'react';
import ReactDOM from 'react-dom';
import { isEmpty } from 'lodash';
// import { AppContainer } from 'react-hot-loader';
import App from './pages/App';

console.log(isEmpty(''));

ReactDOM.render(<App/>, document.getElementById('root'));

// hot-react-loader 处理hmr
// if (module.hot) {
//   module.hot.accept(function () {
//     ReactDOM.render(
//       (<AppContainer>
//         <App/>
//       </AppContainer>)
//       , document.getElementById('root'));
//   });
// }
