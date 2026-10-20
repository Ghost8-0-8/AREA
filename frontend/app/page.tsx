'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Google, Visibility, VisibilityOff } from '@mui/icons-material';
import { FaDiscord } from 'react-icons/fa';
import styles from './login.module.css';
import backgroundStyles from './modules/Background.module.css';
import Loading from "./components/loading/Loading";
import NavbarLogin from "./components/navbar/NavbarLogin";
import { useTranslations } from './translation/useTranslations';
import { useTheme } from './features/ThemeContext';


const Welcome: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslations();
  const { isNightMode } = useTheme();

  const handleSubmit = async (event: React.FormEvent) => {
    setIsLoading(true); 
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "password": password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data.token);
        localStorage.setItem('token', data.token);
        window.location.href = '/pages/home';
      } else {
        console.error('Login failed:', data.error);
        alert(data.error || 'Login failed, please try again.');
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleDiscordLogin = () => {
    window.location.href = 'http://localhost:8080/api/auth/discord'; 
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8080/api/auth/google';
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={`${backgroundStyles['background-wrapper']} ${isNightMode ? backgroundStyles['night-mode'] : ''}`}>

    {isLoading ? (
        <div className={`${styles.container} ${isNightMode ? styles['night-mode-container'] : ''}`}>
        <Loading />
        <h1>{t('loading')}</h1>
        <p>{t('redirect')}</p>
      </div>
    ) : (
    
    <div>
        <NavbarLogin/>
      <div className={`${styles.wrapper} ${isNightMode ? styles['night-mode-wrapper'] : ''}`}>

        <h1>{t('welcome')}</h1>
        <div className={styles['login-form']}>
          <form onSubmit={handleSubmit}>
            <div className={styles['input-box']}>
              <input
                type="text"
                placeholder={t('email')}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <i className="bx bxs-user"></i>
            </div>
            <div className={`${styles['input-box']} ${styles['password-box']}`}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('password')}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <i className="bx bxs-lock-alt"></i>
              <span
                className={styles['toggle-password']}
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
            <div className={`${styles['remember-forgot']} ${isNightMode ? styles['remember-forgot-night'] : ''}`}>
              <label>
                <input type="checkbox" />
                {t('rememberme')}
              </label>
              <Link href="/features/auth/forgot-password">{t('forgotpassword')}</Link>
            </div>
            <button type="submit" className={styles['btn-login']}>{t('login')}</button>
            <div className={styles['register-link']}>
              <Link href="./features/auth/register/">
                <button type="button" className={styles['btn-register']}>{t('register')}</button>
              </Link>
              <h2>{t('or')}</h2>
              <button type="button"   className={`${styles['btn-google']} ${isNightMode ? styles['btn-google-night'] : ''}`}  onClick={handleGoogleLogin}>
                <Google className={`${styles['google-icon-icon']} ${isNightMode ? styles['google-icon-night'] : ''}`} />
                {t('google')}
              </button>
              <button type="button" className={`${styles['btn-discord']} ${isNightMode ? styles['btn-discord-night'] : ''}`}  onClick={handleDiscordLogin}>
               <FaDiscord className={`${styles['discord-icon']} ${isNightMode ? styles['discord-icon-night'] : ''}`} />
                {t('discord')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    )}
  </div>
  );
};

export default Welcome;



