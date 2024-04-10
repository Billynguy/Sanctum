import React, { createContext, useState, useEffect } from 'react';

const useSessionContext = () => {
    const [session, setSession] = useState({
        loggedIn: false,
        username: null,
        userType: null,
        email: null,
        phone: null,
        region: null
    });

    // useEffect(() => {
    //     console.log("Session updated:", session);
    // }, [session]);

    const login = (userData) => {
        setSession({ 
            loggedIn: true, 
            username: userData.username,
            userType: userData.userType,
            email: userData.email,
            phone: userData.phone,
            region: userData.region
        });
    };

    const logout = () => {
        setSession({
            loggedIn: false,
            username: null,
            userType: null,
            email: null,
            phone: null,
            region: null
        });
    };

    return { session, login, logout };
};

const SessionContext = createContext();

function SessionProvider({ children }) {
    const contextValue = useSessionContext();
    return (
        <SessionContext.Provider value={contextValue}>
        {children}
        </SessionContext.Provider>
    );
};

export { SessionProvider, SessionContext};
