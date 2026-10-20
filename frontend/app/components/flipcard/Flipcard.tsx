import React, { useState } from 'react';
import ReactCardFlip from 'react-card-flip';
import styles from './Flipcard.module.css'; 
import { useTheme } from '../../features/ThemeContext';

type FlipCardProps = {
  frontContent: string;
  backContent: React.ReactNode;
  className?: string;
};

const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent, className }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const { isNightMode, toggleTheme } = useTheme();

  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
      <div className={styles.card} onClick={handleClick}>
        <div className={`${styles.front} ${isNightMode ? styles['night-mode-front'] : ''}`}>

          <div className={`${styles['icon-circle']} ${className}`}></div>
          <p>{frontContent}</p>
        </div>
      </div>

      <div className={styles.card} onClick={handleClick}>
        <div className={`${styles.back} ${isNightMode ? styles['night-mode-back'] : ''}`}>
          {backContent}
        </div>
      </div>
    </ReactCardFlip>
  );
};

export default FlipCard;