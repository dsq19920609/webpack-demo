import React, { useEffect } from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { createSelector } from  'reselect';
import styles from './index.less';

const selectNumCompletedTodos = createSelector(
  (state) => state.user,
)

const My = () => {

  // useSelector()接收一个函数，函数的参数为state
  const user = useSelector(selectNumCompletedTodos);

  // redux的store对象
  const store = useStore();
  // store.dispatch
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: 'UPDATE', payload: { name: 'dong' } });
    console.log(store.getState());
  }, []);
  
  const changeName = () => {
    dispatch({ type: 'UPDATE', payload: { name: 'zhang' } })
  };

  return (
    <div className={styles.container}>
      <h4>{user.name}</h4>
      <button onClick={changeName}>修改名称</button>
    </div>
  )
}

export default My;
