import React, { createContext, useState } from 'react';

// Create the context
// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext();

// Create and export the provider
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const updateUser = (userData) => {
        setUser(userData);
    };

    const clearUser = () => {
        setUser(null);
    };

    return (
        <UserContext.Provider
            value={{
                user,
                updateUser,
                clearUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
