import React from "react";
import styles from "./Button.module.css";
import { useTheme } from '../../features/ThemeContext';


type ButtonProps = {
    text: string;
    onClick: () => void;
    isSelected: boolean;
  };
  
  const Button: React.FC<ButtonProps> = ({ text, onClick, isSelected }) => {
    const { isNightMode, toggleTheme } = useTheme();
    return (
      <button
        onClick={onClick}
        className={`${styles.button} ${isNightMode ? styles['night-mode-button'] : ''} ${isSelected ? styles.selected : ''}`}
      >
        {text}
      </button>
    );
  };
  
  export default Button;