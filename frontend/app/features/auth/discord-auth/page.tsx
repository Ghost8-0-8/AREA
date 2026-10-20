'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from "./Discord.module.css";
import Loading from "../../../components/loading/Loading"
//import backgroundStyles from './modules/Background.module.css';
import { useTranslations } from '../../../translation/useTranslations'; 
import { useTheme } from '../../../features/ThemeContext';

const DiscordCallback: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslations();
  const { isNightMode } = useTheme();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('token', token);
      router.push('/pages/home'); 
    } else {
    
      console.error('No token found in URL');
      alert('Authentication failed, please try again.');
      router.push('/');
    }
  }, [router]);

  return (
    //<div className={`${backgroundStyles['background-wrapper']} ${isNightMode ? backgroundStyles['night-mode'] : ''}`}>
      <div className={`${styles.container} ${isNightMode ? styles['night-mode-container'] : ''}`}>
      <Loading />
      <h1>{t('loading')}</h1>
      <p>{t('redirect')}</p>
    </div>
    //</div>
  );
};

export default DiscordCallback;
