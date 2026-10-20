"use client";

import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import style from './Activity.module.css';
import '../../globals.css';
import { useTheme } from '../../features/ThemeContext';


const Activity: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { isNightMode } = useTheme();

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
      <div className={style['content']} style={contentStyle}>
        <div className={style['bubblesContainer']}>
          <div className={style.bubble}>
            <div className={style.topSection}>
              <div className={style.dateTime}>
                <div className={style.date}>11/11/2011</div>
                <div className={style.time}>19:42</div>
              </div>
              <div className={style.linkSection}>
                <div className={style.iconPlaceholder}></div>
                <div className={style.iconPlaceholder}></div>
                <div className={style.linkText}>Link 1</div>
              </div>
            </div>
            <div className={style.messageTitle}>Comment</div>
            <div className={style.messageBox}>
              <p className={style.innerText}>
                Everyday notification at 19:42 send mail to student to remenber them to push.
              </p>
            </div>
          </div>
  
          <div className={style.bubble}>
            <div className={style.topSection}>
              <div className={style.dateTime}>
                <div className={style.date}>12/12/2012</div>
                <div className={style.time}>20:15</div>
              </div>
              <div className={style.linkSection}>
                <div className={style.iconPlaceholder}></div>
                <div className={style.iconPlaceholder}></div>
                <div className={style.linkText}>Link 2</div>
              </div>
            </div>
            <div className={style.messageTitle}>Comment</div>
            <div className={style.messageBox}>
              <p className={style.innerText}>
                Everyday at 20:15, notification to the team for playing video games.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}  

export default Activity;
