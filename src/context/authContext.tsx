import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '@/lib/axiosInstance';
import { Session } from '@/typings/session';

interface SessionContextType {
    session: Session | null;
    loading: boolean;
    error: string | null;
}

const defaultContext: SessionContextType = {
    session: null,
    loading: true,
    error: null,
};

const SessionContext = createContext<SessionContextType>(defaultContext);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSession = async () => {
            try {
                const cachedSession = localStorage.getItem('session');
                if (cachedSession) {
                    setSession(JSON.parse(cachedSession));
                    setLoading(false);
                } else {
                    const { data } = await axiosInstance.get("/get-session");
                    console.log(data.message)
                    setSession(data.message);
                    localStorage.setItem('session', JSON.stringify(data.message));
                    setLoading(false);
                }
            } catch (err) {
                setError('Failed to fetch session');
                setLoading(false);
            }
        };

        fetchSession();
    }, []);

    return (
        <SessionContext.Provider value={{ session, loading, error }}>
            {children}
        </SessionContext.Provider>
    );
};

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSession must be used within a SessionProvider');
    }
    return context;
};
