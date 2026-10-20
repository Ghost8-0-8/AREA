"use client"; 
import React, { useState } from 'react';
import styles from './NavbarLogin.module.css';
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

    const changeLanguage = (lang: 'en' | 'fr' | 'cn') => {
        setLanguage(lang);
    };

    return (
        <>
            <div className={`${styles['navbar-wrapper']} ${isNightMode ? styles['night-mode'] : ''}`} style={{ fontSize: `${textSize}px` }}>
                <nav className={`${styles['navbar-container']} ${isNightMode ? styles['night-mode-navbar'] : ''}`}>
                    <div className={styles['left-section']}>
                        <h1 className={`${styles['nav-title']} ${isNightMode ? styles['night-mode-nav-title'] : ''}`}>A-REA</h1>
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
                    </div>
                </nav>
            </div>
        </>
    );
};

export default Navbar;
