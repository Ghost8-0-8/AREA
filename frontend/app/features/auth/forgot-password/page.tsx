'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './ForgotPassword.module.css';
import backgroundStyles from '../../../modules/Background.module.css';
import { ArrowBack } from '@mui/icons-material';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <div className={backgroundStyles['background-wrapper']}>
      <div className={styles.wrapper}>
        <Link href="../../../" className={styles['back-link']}>
          <ArrowBack />
        </Link>
        <h1>Forgot Password</h1>
        <div className={styles['login-form']}>
          <form onSubmit={handleSubmit}>
            <div className={styles['input-box']}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className={styles['btn-send-link']}>Send Link</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
