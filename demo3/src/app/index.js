import React from 'react';
import styles from './index.less';
import { treeshakingFunc } from '../test';
import { isArray } from 'lodash';

treeshakingFunc();

export default () => {
  return (
    <div className={styles.container}>
      {
        isArray([]) ? 'dong' : 'zhang'
      }
    </div>
  )
}