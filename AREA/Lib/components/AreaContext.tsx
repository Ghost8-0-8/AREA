import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Area {
    _id: string;
    action: {
        service: string;
        method: string;
        params: Record<string, string>;
    };
    reaction: {
        service: string;
        method: string;
        params: Record<string, string>;
    };
}

interface AreaContextType {
    areas: Area[];
    setAreas: React.Dispatch<React.SetStateAction<Area[]>>;
}

const AreaContext = createContext<AreaContextType | undefined>(undefined);

export const AreaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [areas, setAreas] = useState<Area[]>([]);

    return (
        <AreaContext.Provider value={{ areas, setAreas }}>
            {children}
        </AreaContext.Provider>
    );
};

export const useArea = (): AreaContextType => {
    const context = useContext(AreaContext);
    if (!context) {
        throw new Error('useArea must be used within an AreaProvider');
    }
    return context;
};
