import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styles from './index.less';

const Home = (props) => {
  const history = useHistory();

  const handle = () => {
    history.push({
      pathname: '/about'
    });
  };

  useEffect(() => {
    props.createUser();
  }, []);

  const changeUser = () => {
    props.updateUser();
  };

  return (
    <div className={styles.container}>
        <h4>名称: {props.user.name}</h4>
        <button onClick={changeUser}>修改名称</button>
    </div>
  )
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    user: state.user
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: () => dispatch(async (dispatch, getState) => {
      // redux中间件，如果action为普通对象，则直接调用dispatch
      // 如果为函数，则将dispatch和getState传入函数
      const name = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve('zhang');
        }, 2000);
      });
      dispatch({ type: 'UPDATE', payload: { name } });
    }),
    createUser: () => dispatch(new Promise((resolve, reject) => {
      // isPromise(action) : action.then(dispatch): next(action)
      // dispatch()的参数可以为一个promise，promise resolve的对象可以被dispatch
      setTimeout(() => {
        resolve({ type: 'CREATE', payload: { name: 'dong' } });
      }, 2000);
    })),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
