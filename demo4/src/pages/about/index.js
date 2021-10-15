import React, { useEffect, useMemo } from 'react';
import { connect } from 'react-redux';
import styles from './index.less';

const About = (props) => {

  useEffect(() => {
    props.createUser();
  }, []);

  const changeName = () => {
    props.updateUser();
  };

  return (
    <div className={styles.container}>
      <h5>About 页面: {props.user.name}</h5>
      <button onClick={changeName}>修改值</button>
    </div>
  )
};

const mapStateToProps = (state, ownProps) => {
  return {
    ownProps,
    user: { ...state.user }
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateUser: () => dispatch({ type: 'UPDATE', payload: { name: 'zhang' } }),
    createUser: () => dispatch({ type: 'UPDATE', payload: { name: 'dong' } }),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(About);
