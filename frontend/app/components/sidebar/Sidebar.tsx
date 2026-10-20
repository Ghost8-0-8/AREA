"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Sidebar.module.css';
import InfoIcon from '@mui/icons-material/Info';
import EastIcon from '@mui/icons-material/East';
import WestIcon from '@mui/icons-material/West';
import { useTheme } from '../../features/ThemeContext';
import { useTranslations } from '../../translation/useTranslations'; 


interface SidebarProps {
  onToggle: (isOpen: boolean) => void; 
}

const Sidebar: React.FC<SidebarProps> = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(true); 
  const { isNightMode } = useTheme();
  const { t } = useTranslations();
  
  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  
  useEffect(() => {
    if (typeof onToggle === "function") { 
      onToggle(isOpen);
    }
  }, [isOpen, onToggle]); 

  
  const sidebarStyle = {
    width: isOpen ? '250px' : '40px',
    padding: isOpen ? '20px' : '0px',
    transition: 'width 0.3s ease',
  };

  return (
    <>
    <div className={`${styles.sidebar} ${isNightMode ? styles['night-mode-sidebar'] : ''}`} style={sidebarStyle}>
        {isOpen && (
          <>
            <nav className={styles.navLinks}>
              <Link href="/pages/home" className={`${styles.navBox} ${isNightMode ? styles['night-mode-navBox'] : ''}`}>
                {t('sidebar_home')}
              </Link>
              <Link href="/pages/explore" className={`${styles.navBox} ${isNightMode ? styles['night-mode-navBox'] : ''}`}>
              {t('sidebar_explore')}
              </Link>
              <Link href="/pages/clientapk" className={`${styles.navBox} ${isNightMode ? styles['night-mode-navBox'] : ''}`}>
              {t('sidebar_clientapk')}
              </Link>
              <Link href="/pages/help" className={`${styles.navBox} ${isNightMode ? styles['night-mode-navBox'] : ''}`}>
              {t('sidebar_help')}
              </Link>
            </nav>
            <div className={`${styles.footer} ${isNightMode ? styles['night-mode-footer'] : ''}`}>
              <InfoIcon className={`${styles.infoIcon} ${isNightMode ? styles['night-mode-infoIcon'] : ''}`} />
              <div className={styles.footerLinks}>
                <Link href="/pages/about">
                  <button className={`${styles.footerLink} ${isNightMode ? styles['night-mode-footerLink'] : ''}`}>
                  {t('sidebar_about_us')}
                  </button>
                </Link>
                <Link href="/pages/contact">
                  <button className={`${styles.footerLink} ${isNightMode ? styles['night-mode-footerLink'] : ''}`}>
                  {t('sidebar_contact_us')}
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <button 
      className = {`${styles.toggleButton} ${isNightMode ? styles['night-mode-toggleButton'] : '' }`}
      onClick={toggleSidebar} 
      aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      style={{ 
        position: 'fixed',
        top: '50%', 
        left: isOpen ? '290px' : '40px',
        transform: 'translateY(-50%)',
        zIndex: 1000
      }} 
    >
      {isOpen ? (
        <WestIcon className={`${styles.arrowIcon} ${isNightMode ? styles['night-mode-arrowIcon'] : ''}`} />
      ) : (
        <EastIcon className={`${styles.arrowIcon} ${isNightMode ? styles['night-mode-arrowIcon'] : ''}`} />
      )}
      </button>
    </>
  );
};
export default Sidebar;