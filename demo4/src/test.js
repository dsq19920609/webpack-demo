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

export const alert = () => {
  window.alert('import5');
};

export const treeshakingFunc = () => {
  console.log('i am treeshakingFunc');
}

