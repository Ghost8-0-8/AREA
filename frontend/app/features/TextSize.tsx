import { createContext, useState, useContext, ReactNode } from 'react';

interface TextSizeProviderProps {
    children: ReactNode;
}

const TextSizeContext = createContext({ textSize: 16, increaseTextSize: () => {}, decreaseTextSize: () => {} });

export const TextSizeProvider = ({ children }: TextSizeProviderProps) => {
    const [textSize, setTextSize] = useState(16); 

    const increaseTextSize = () => {
        setTextSize((prevSize) => Math.min(prevSize + 2, 48)); 
    };

    const decreaseTextSize = () => {
        setTextSize((prevSize) => Math.max(prevSize - 2, 12)); 
    };

    return (
        <TextSizeContext.Provider value={{ textSize, increaseTextSize, decreaseTextSize }}>
            {children}
        </TextSizeContext.Provider>
    );
};

export const useTextSize = () => useContext(TextSizeContext);
