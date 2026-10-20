"use client";
import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import style from './Clientapk.module.css';
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
        
        <div className={style.centeredContainer}>
          <div className={style.card}>
            <div className={style.image_container}>
              <div className={style.image}></div>
            </div>
            <div className={style.title}>
              <span>A-REA</span>
            </div>
            <div className={style.size}>
              <span>{t('version')}</span>
              <ul className={style.list_size}>
                <li className={style.item_list}>
                  <button className={style.item_list_button}>1.0</button>
                </li>
              </ul>
            </div>
            <div className={style.action}>
              <a href="/client/AREA.apk" download className={style.button}>
                <span className={style.button__text}>{t('download')}</span>
                <span className={style.button__icon}>
                  <svg className={style.svg} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 35 35">
                    <path d="M17.5,22.131a1.249,1.249,0,0,1-1.25-1.25V2.187a1.25,1.25,0,0,1,2.5,0V20.881A1.25,1.25,0,0,1,17.5,22.131Z"></path>
                    <path d="M17.5,22.693a3.189,3.189,0,0,1-2.262-.936L8.487,15.006a1.249,1.249,0,0,1,1.767-1.767l6.751,6.751a.7.7,0,0,0,.99,0l6.751-6.751a1.25,1.25,0,0,1,1.768,1.767l-6.752,6.751A3.191,3.191,0,0,1,17.5,22.693Z"></path>
                    <path d="M31.436,34.063H3.564A3.318,3.318,0,0,1,.25,30.749V22.011a1.25,1.25,0,0,1,2.5,0v8.738a.815.815,0,0,0,.814.814H31.436a.815.815,0,0,0,.814-.814V22.011a1.25,1.25,0,1,1,2.5,0v8.738A3.318,3.318,0,0,1,31.436,34.063Z"></path>
                  </svg>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default Help;
