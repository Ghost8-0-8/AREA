"use client"
import React from 'react';
import '../../globals.css';
import styles from './About.module.css';
import Navbar  from '../../components/navbar/Navbar';
import { useTheme } from '../../features/ThemeContext';
import { useTranslations } from '../../translation/useTranslations'; 

const About: React.FC = () => {
  const { isNightMode } = useTheme();
  const { t } = useTranslations();

  return (
    <div className={`${styles.background} ${isNightMode ? styles['night-mode'] : ''}`}>

      <Navbar />
      
      <section className={styles.aboutUs}>
       <div className={`${styles.container} ${isNightMode ? styles['night-mode-container'] : ''}`}>
        <h1 className={`${styles.title} ${isNightMode ? styles['night-mode-title'] : ''}`}>{t('aboutUs')}</h1>
          <p className={styles.intro}>
          {t('infoAboutUs')}
          </p>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('ourHistory')}</h2>
            <p className={styles.text}>
            {t('infoOurHistory')}
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('ourMission')}</h2>
            <p className={styles.text}>
            {t('infoOurMission')}
            </p>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>{t('ourTeam')}</h2>
            <p className={styles.text}>
            {t('infoOurTeam')}
            </p>

            <div className={styles.teamGrid}>
              <div className={styles.teamMember}>
                <div className={styles.teamImage} />
                <p>Adam Benzidane</p>
              </div>
              <div className={styles.teamMember}>
                <div className={styles.teamImage} />
                <p>Celestin Godefroy-Mourier</p>
              </div>
              <div className={styles.teamMember}>
                <div className={styles.teamImage} />
                <p>Elisa Huang</p>
              </div>
              <div className={styles.teamMember}>
                <div className={styles.teamImage} />
                <p>Anthony Girard</p>
              </div>
              <div className={styles.teamMember}>
                <div className={styles.teamImage} />
                <p>Sonny Rameaux</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;