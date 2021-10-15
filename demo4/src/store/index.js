import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk'; // 改变action的类型为函数
import reduxPromise  from 'redux-promise'; // 改变action的类型为promise
import reduxLogger from 'redux-logger';
import userReducer from './reducers/userReducer';

const middleware = [thunk, reduxPromise];

const devtools = [];
if (process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__) {
  middleware.push(reduxLogger);
  devtools.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const store = createStore(combineReducers({
  user: userReducer
}), compose(applyMiddleware(...middleware), ...devtools));


export default store;