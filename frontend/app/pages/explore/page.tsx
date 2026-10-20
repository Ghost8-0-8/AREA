"use client";

import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import FlipCard from '@/app/components/flipcard/Flipcard';
import styles from './Explore.module.css';
import '../../globals.css';
import { useTheme } from '../../features/ThemeContext';
import { useTranslations } from '../../translation/useTranslations'; 

const Explore: React.FC = () => {
  const { isNightMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useTranslations();

  const handleToggleSidebar = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const handleAuthRedirect = (app: string) => {
    window.location.href = `http://localhost:8080/api/auth/${app}`;
  };

  const contentStyle = {
    marginLeft: isSidebarOpen ? '250px' : '50px',
    transition: 'margin-left 0.3s ease',
  };

  const flipCardData = [
    {
      className: styles['gmail'],
      title: "Google",
      description: t('descriptionGmail'),
      points: [
        t('infoGmail1'),
        t('infoGmail2'),
        t('infoGmail3')
      ],
      oauth: 'google'
    },
    {
      className: styles['cat'],
      title: "Cat API",
      description: t('descriptionCatAPI'),
      points: [
        t('infoCatAPI1')
      ],
      oauth: ''
    },
    {
      className: styles['discord'],
      title: "Discord",
      description: t('descriptionDiscord'),
      points: [
        t('infoDiscord1'),
        t('infoDiscord2'),
        t('infoDiscord3')
      ],
      oauth: 'discord'
    },
    {
      className: styles['spotify'],
      title: "Spotify",
      description: t('descriptionSpotify'),
      points: [
        t('infoSpotify1'),
        t('infoSpotify2'),
        t('infoDiscord3')
      ],
      oauth: 'spotify'
    },
    {
      className: styles['riot'],
      title: "Riot Games",
      description: t('descriptionRiot'),
      points: [
        t('infoRiot1'),
        t('infoRiot2'),
        t('infoRiot3')
      ],
      oauth: ''
    },
    {
      className: styles['steam'],
      title: "Steam",
      description: t('descriptionSteam'),
      points: [
        t('infoSteam1'),
        t('infoSteam2'),
        t('infoSteam3')
      ],
      oauth: ''
    }
  ];

  return (
    <div className={`${styles.background} ${isNightMode ? styles['night-mode'] : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleToggleSidebar} />
      <div className={`${styles.content} ${isNightMode ? styles['night-mode-content'] : ''}`} style={contentStyle}>
        <div className={styles['flip-card-container']}>
          {flipCardData.map((card, index) => (
            <div key={index} className={styles['card-container']}>
              <FlipCard 
                className={`${styles['icon-circle']} ${card.className}`} 
                frontContent="" 
                backContent={
                  <>
                    <strong>{card.title}</strong>
                    <p>{card.description}</p>
                    <ul>
                      {card.points.map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </>
                } 
              />
              {card.oauth ? (
                <button
                  className={`${styles.button} ${styles[`btn-${card.oauth}`]} ${isNightMode ? styles['night-mode-button'] : ''}`}
                  onClick={() => handleAuthRedirect(card.oauth)}
                >
                  {t('sign')} {card.title}
                </button>
              ) : (
                <button
                  className={`${styles.noneedbutton} ${styles['btn-no-auth']} ${isNightMode ? styles['night-mode-noneed-button'] : ''}`}
                  onClick={() => null}
                >
                  {t('noneed')}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );  
};

export default Explore;