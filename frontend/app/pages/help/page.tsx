"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import style from './Help.module.css';
import '../../globals.css';
import { useTheme } from '../../features/ThemeContext';
import { useTranslations } from '../../translation/useTranslations'; 

const Help: React.FC = () => {
  const { isNightMode } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { t } = useTranslations();

  const handleToggleSidebar = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const contentStyle = {
    marginLeft: isSidebarOpen ? '250px' : '50px',
    transition: 'margin-left 0.3s ease', 
  };

  return (
    <div className={`${style.background} ${isNightMode ? style['night-mode'] : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleToggleSidebar} />
      <div className={`${style.content} ${isNightMode ? style['night-mode-content'] : ''}`} style={contentStyle}>
        <h1 className={`${style.title} ${isNightMode ? style['night-mode-title'] : ''}`}>{t('guide')}</h1>
        <div className={`${style.bubbles} ${isNightMode ? style['night-mode-bubbles'] : ''}`}>
          <Link href="/pages/area" className={`${style.bubble} ${isNightMode ? style['night-mode-bubble'] : ''}`}>
            <h2>{t('whatisArea')}</h2>
            <p>{t('descriptionArea')}</p>
          </Link>
          <Link href="/pages/home" className={`${style.bubble} ${isNightMode ? style['night-mode-bubble'] : ''}`}>
            <h2>{t('sidebar_home')}</h2>
            <p>{t('descriptionHome')}</p>
          </Link>
          <Link href="/pages/explore" className={`${style.bubble} ${isNightMode ? style['night-mode-bubble'] : ''}`}>
            <h2>{t('sidebar_explore')}</h2>
            <p>{t('descriptionExplore')}</p>
          </Link>
          <Link href="/pages/help" className={`${style.bubble} ${isNightMode ? style['night-mode-bubble'] : ''}`}>
            <h2>{t('sidebar_help')}</h2>
            <p>{t('descriptionHelp')}</p>
          </Link>
          <Link href="/pages/clientapk" className={`${style.bubble} ${isNightMode ? style['night-mode-bubble'] : ''}`}>
            <h2>{t('sidebar_clientapk')}</h2>
            <p>{t('descriptionClientApk')}</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;