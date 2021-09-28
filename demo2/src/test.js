import test from './test';

export const callback = (fn, delay) => {
  let timer = null;
  return function () {
    const that = this;
    if (timer) timer = null;
    setTimeout(() => {
      fn.apply(that, arguments);
    }, delay);
  }
}

export const treeshakingFunc = () => {
  console.log('i am treeshakingFunc');
}

