'use client';

import {createContext, useContext, useEffect, useState} from 'react';
import {useApolloClient, useLazyQuery} from '@apollo/client';
import {CURRENT_USER_QUERY, useAuth} from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const auth = useAuth();
    const client = useApolloClient();

    const [getCurrentUser] = useLazyQuery(CURRENT_USER_QUERY, {
        onCompleted: (data) => {
            setUser(data.getCurrentUser);
            setLoading(false);
        },
        onError: () => {
            auth.logout();
            setLoading(false);
        },
    });

    useEffect(() => {
        // Check if token exists
        const token = auth.getAuthToken();
        if (token) {
            // Try to fetch current user
            getCurrentUser();
        } else {
            setLoading(false);
        }
    }, []);

    const login = (token, userData) => {
        auth.login(token, userData);
        setUser(userData);
    };

    const logout = () => {
        auth.logout();
        setUser(null);
        // Clear Apollo cache on logout
        client.resetStore();
    };

    const updateUser = (updatedUserData) => {
        setUser(prev => ({...prev, ...updatedUserData}));
    };

    return (
        <AuthContext.Provider value={{user, login, logout, updateUser, loading, isAuthenticated: !!user}}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuthContext = () => useContext(AuthContext);