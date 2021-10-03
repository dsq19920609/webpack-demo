import React from 'react';
import { useHistory } from 'react-router-dom';
import styles from './index.less';

const Home = () => {
  const history = useHistory();

  const handle = () => {
    history.push({
      pathname: '/about'
    });
  }

  return (
    <div className={styles.container} onClick={handle}>
        home 页面
    </div>
  )
}

export default Home;
