
import React, { createContext, useContext, useState, ReactNode } from 'react';


interface ThemeContextProps {
    isNightMode: boolean;
    toggleTheme: () => void;
}


const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isNightMode, setIsNightMode] = useState(false);

    const toggleTheme = () => {
        setIsNightMode(prevMode => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isNightMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};


export const useTheme = (): ThemeContextProps => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
