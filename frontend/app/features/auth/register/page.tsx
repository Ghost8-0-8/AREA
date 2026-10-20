'use client';

import React, { useState } from 'react';
import { Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import Link from 'next/link';
import backgroundStyles from '../../../modules/Background.module.css';
import styles from './Register.module.css';
import { useRouter } from 'next/navigation';
import { useTranslations } from '../../../translation/useTranslations'; 
import NavbarLogin from '../../../components/navbar/NavbarLogin';
import { useTheme } from '../../../features/ThemeContext';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslations();
  const { isNightMode } = useTheme();

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Submitting form...");
   if (password !== confirmPassword) {
    
    alert('Passwords do not match.');
    return;
   }

   try {
    const response = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email" : email,
        "password" : password,
        "firstName" : name,
        "lastName" : surname
      })
    });

     const data = await response.json();

     if (response.ok) {
      
       console.log('User registered successfully:', data);
       router.push('/');
     } else {
       console.error('Error response:', data);
      
      alert(data.error || 'Registration failed');
     }
   } catch (err) {
     console.error('An unexpected error occurred:', err);
    
    alert('An unexpected error occurred. Please try again.');
   }
 };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const toggleTermsAcceptance = () => {
    setAcceptTerms(!acceptTerms);
    if (!acceptTerms) {
      setShowModal(true); 
    }
  };

  const handleAcceptTerms = () => {
    setAcceptTerms(true);
    setShowModal(false); 
  };

  const handleRejectTerms = () => {
    setAcceptTerms(false);
    setShowModal(false); 
  };

  return (
    <div className={`${backgroundStyles['background-wrapper']} ${isNightMode ? backgroundStyles['night-mode'] : ''}`}>
      <div>
          <NavbarLogin/>
        <div className={`${styles.wrapper} ${isNightMode ? styles['night-mode-wrapper'] : ''}`}>
        <Link href="../../" className={styles['back-button']}>
          <ArrowBack />
        </Link>
        <h1>{t('register')}</h1>
        <div className={styles['register-form']}>
          <form onSubmit={handleSubmit}>
            <div className={styles['input-box-group']}>
              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder={t('lastname')}
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder={t('firstname')}
                  required
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
            </div>

            <div className={styles['input-box-group']}>
              <div className={styles['input-box']}>
                <input
                  type="text"
                  placeholder={t('username')}
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className={styles['input-box']}>
                <input
                  type="date"
                  placeholder={t('birthday')}
                  required
                  value={birthday}
                  onChange={(e) => setBirthday(e.target.value)}
                />
              </div>
            </div>

            <div className={styles['input-box-group']}>
              <div className={styles['input-box']}>
                <input
                  type="email"
                  placeholder={t('email')}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className={styles['input-box']}>
                <input
                  type="tel"
                  placeholder={t('email')}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className={styles['password-group']}>
              <div className={styles['password-box']}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('password')}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span
                  className={styles['toggle-password']}
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>

            <div className={styles['password-group']}>
              <div className={styles['password-box']}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={t('confirm')}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <span
                  className={styles['toggle-password']}
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
            </div>

            <div className={styles['user-conditions']}>
              <label>
                <input type="checkbox" />
                {t('acceptAds')}
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={toggleTermsAcceptance}
                />
                {t('acceptTerms')}
              </label>
            </div>
            <button
              type="submit"
              className={styles['btn-register']}
              disabled={!acceptTerms}
            >
              {t('createAccount')}
            </button>
          </form>
        </div>
      </div>

      {showModal && (
        <div className={styles.modal}>
          <div className={styles['modal-content']}>
            <h2>{t('terms')}</h2>
            <div className={styles['modal-text']}>
              <p>{t('termsWelcome')}</p>
              <p><strong>{t('acceptance')}</strong></p>
              <p>{t('infoacceptance')}</p>
              <p><strong>{t('usesite')}</strong></p>
              <p>{t('infousesite')}</p>
              <p><strong>{t('intellectual')}</strong></p>
              <p>{t('infointellectual')}</p>
              <p><strong>{t('external')}</strong></p>
              <p>{t('infoexternal')}</p>
              <p><strong>{t('limitation')}</strong></p>
              <p>{t('infolimitation')}</p>
              <p><strong>{t('modification')}</strong></p>
              <p>{t('infomodification')}</p>
              <p>{t('thanks')}</p>
            </div>
            <div className={styles['modal-buttons']}>
              <button onClick={handleAcceptTerms} className={styles['btn-accept']}>
              {t('accept')}
              </button>
              <button onClick={handleRejectTerms} className={styles['btn-reject']}>
              {t('reject')}
              </button>
            </div>
          </div>
        </div>

      )}
    </div>
    </div>
  );
};

export default Register;
