"use client";

import React, { useState } from 'react';
import Navbar from '../../components/navbar/Navbar';
import Sidebar from '../../components/sidebar/Sidebar';
import '../../globals.css';
import BubbleList from '../../components/card/Card';
import { useTheme } from '../../features/ThemeContext';
import styles from "./Myarea.module.css"

const Myarea: React.FC = () => {
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
    <div className={`${styles.background} ${isNightMode ? styles['night-mode'] : ''}`}>
      <Navbar />
      <Sidebar onToggle={handleToggleSidebar} />
  
      <div className={`${styles.content} ${isNightMode ? styles['night-mode-content'] : ''}`} style={contentStyle}>
        <BubbleList showFavorites={false} /> 
      </div>
    </div>
  ); 
}

export default Myarea;
