import React from 'react';
import styles from './Loading.module.css';
import { useTheme } from '../../features/ThemeContext';

const Spinner: React.FC = () => {
  const { isNightMode } = useTheme();

  return (
    <div className={`${styles.spinner} ${isNightMode ? styles['night-mode'] : ''}`}>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  );
};

export default Spinner;
