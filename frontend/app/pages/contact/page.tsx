"use client"

import '../../globals.css';
import React, { useState } from 'react';
import styles from './Contact.module.css';
import Navbar  from '../../components/navbar/Navbar';
import { useTheme } from '../../features/ThemeContext';
import { useTranslations } from '../../translation/useTranslations'; 


const Contact: React.FC = () => {
  const { isNightMode } = useTheme();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const { t } = useTranslations();
  const [responseMessage, setResponseMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
        const res = await fetch('/sendEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, message }),
        });

        const data = await res.json();

        if (res.ok) {
            setResponseMessage(data.message);
            setEmail('');
            setMessage('');
        } else {
            setResponseMessage(data.error);
        }
    } catch (error) {
        console.error(error);
        setResponseMessage("Une erreur s'est produite lors de l'envoi de l'e-mail.");
    } finally {
        setLoading(false);
    }
};

  return (
    <div className={`${styles.background} ${isNightMode ? styles['night-mode'] : ''}`}>
      <Navbar />
    <div className={`${styles.card} ${isNightMode ? styles['night-mode-card'] : ''}`}>
        <h2>{t('contactUs')}</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              placeholder={t('enterMail')}
            />
          </div>
          <div className={styles.inputGroup}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className={styles.textarea}
              placeholder={t('writeMessage')}
            />
          </div>
          <button type="submit" className={`${styles.button} ${isNightMode ? styles['night-mode-button'] : ''}`}>{t('send')}</button>
        </form>
      </div>
      </div>
  );
};

export default Contact;