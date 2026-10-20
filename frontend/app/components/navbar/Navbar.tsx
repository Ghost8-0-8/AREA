"use client"; 
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import UserCard from '../usercard/Usercard';
import SwitchMode from '../switchmode/SwitchMode';
import { useTheme } from '../../features/ThemeContext';
import { useTextSize } from '../../features/TextSize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearchPlus, faSearchMinus } from '@fortawesome/free-solid-svg-icons';

import { useLanguage } from '../../translation/LanguageContext';
import { useTranslations } from '../../translation/useTranslations';

const Navbar = () => {
    const { isNightMode, toggleTheme } = useTheme();
    const { textSize, increaseTextSize, decreaseTextSize } = useTextSize();
    const { language, setLanguage } = useLanguage(); 
    const { t } = useTranslations();
    const [isUserCardVisible, setIsUserCardVisible] = useState(false);

    const handleToggleUserCard = () => {
        setIsUserCardVisible((prevState) => !prevState);
    };

    const changeLanguage = (lang: 'en' | 'fr' | 'cn') => {
        setLanguage(lang);
    };

    return (
        <>
            <div className={`${styles['navbar-wrapper']} ${isNightMode ? styles['night-mode'] : ''}`} style={{ fontSize: `${textSize}px` }}>
                <nav className={`${styles['navbar-container']} ${isNightMode ? styles['night-mode-navbar'] : ''}`}>
                    <div className={styles['left-section']}>
                        <Link href="/pages/home" className={`${styles['logout-link']}`}>
                            <h1 className={`${styles['nav-title']} ${isNightMode ? styles['night-mode-nav-title'] : ''}`}>A-REA</h1>
                        </Link>
                    </div>
                    <div className={styles['center-section']}></div>
                    <div className={styles['right-section']}>
                        <div className={styles['flag-icons']}>
                            <button onClick={() => changeLanguage('fr')} title="Français" className={`${styles['flag-circle']} ${styles['france']}`}></button>
                            <button onClick={() => changeLanguage('en')} title="English" className={`${styles['flag-circle']} ${styles['uk']}`}></button>
                            <button onClick={() => changeLanguage('cn')} title="中文" className={`${styles['flag-circle']} ${styles['china']}`}></button>
                        </div>
                        <SwitchMode
                            checked={isNightMode}
                            onChange={toggleTheme}
                            className={`${styles['switch']} ${isNightMode ? styles['night-mode'] : ''}`}
                        />
                        <button onClick={increaseTextSize} className={`${styles['zoom-button']} ${isNightMode ? styles['night-mode-zoom-button'] : ''}`}>
                            <FontAwesomeIcon icon={faSearchPlus} />
                        </button>
                        <button onClick={decreaseTextSize} className={`${styles['zoom-button']} ${isNightMode ? styles['night-mode-zoom-button'] : ''}`}>
                            <FontAwesomeIcon icon={faSearchMinus} />
                        </button>
                        <button onClick={handleToggleUserCard} className={`${styles['user-button']} ${isNightMode ? styles['night-mode-user-button'] : ''}`}>
                            <AccountCircleIcon className={isNightMode ? styles['night-mode-icon'] : ''} />
                        </button>
                        <Link href="/" className={`${styles['logout-link']} ${isNightMode ? styles['night-mode-logout-link'] : ''}`}>
                            <LogoutIcon className={isNightMode ? styles['night-mode-icon'] : ''} />
                        </Link>
                    </div>
                </nav>
            </div>

            {isUserCardVisible && (
                <div className={styles['user-card-container']}>
                    <UserCard />
                </div>
            )}
        </>
    );
};

export default Navbar;
