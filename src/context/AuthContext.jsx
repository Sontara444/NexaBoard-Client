// /client/src/context/AuthContext.jsx
'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);       // user object (with avatar)
    const [loading, setLoading] = useState(true); // initial loading flag
    const router = useRouter();

    // Helper: set auth state and persist data
    const setAuth = (userObj, token, remember = true) => {
        // create avatar letter from username (fallback to firstName / name)
        const nameKey = userObj.username || userObj.name || userObj.firstName || userObj.email || 'User';
        const avatar = ('' + nameKey).charAt(0).toUpperCase();

        const formatted = { ...userObj, avatar };

        // store token in cookie (not httpOnly) and user in localStorage
        // NOTE: httpOnly cookies require backend set-cookie from server.
        if (remember) Cookies.set('token', token, { expires: 30 });
        localStorage.setItem('user', JSON.stringify(formatted));
        setUser(formatted);

        // set axios default header for immediate requests in same session
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    };

    // initial load: try token from cookie and fetch or restore user
    useEffect(() => {
        let mounted = true;
        const initAuth = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    // no token -> no user, done
                    if (mounted) setLoading(false);
                    return;
                }

                // If we already have user in localStorage, use it (fast)
                const stored = localStorage.getItem('user');
                if (stored) {
                    api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    if (mounted) setUser(JSON.parse(stored));
                    if (mounted) setLoading(false);
                    // optional: refresh profile in background (non-blocking)
                    api.get('/auth/profile').then(({ data }) => {
                        const nameKey = data.username || data.name || data.firstName || data.email || 'User';
                        const avatar = ('' + nameKey).charAt(0).toUpperCase();
                        const formatted = { ...data, avatar };
                        localStorage.setItem('user', JSON.stringify(formatted));
                        if (mounted) setUser(formatted);
                    }).catch(() => {
                        // if profile fetch fails (expired token) then clear
                        Cookies.remove('token');
                        localStorage.removeItem('user');
                        if (mounted) setUser(null);
                    });
                    return;
                }

                // no stored user -> fetch profile from server (this is the robust path)
                api.defaults.headers.common.Authorization = `Bearer ${token}`;
                const { data } = await api.get('/auth/profile');
                const nameKey = data.username || data.name || data.firstName || data.email || 'User';
                const avatar = ('' + nameKey).charAt(0).toUpperCase();
                const formatted = { ...data, avatar };
                localStorage.setItem('user', JSON.stringify(formatted));
                if (mounted) setUser(formatted);
            } catch (err) {
                Cookies.remove('token');
                localStorage.removeItem('user');
                if (mounted) setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        return () => { mounted = false; };
    }, []);

    // login: called after successful POST /auth/login
    const login = ({ user, token }, remember = true) => {
        setAuth(user, token, remember);
    };


    // alternative login signature when you call login(userData, token)
    const loginAlt = (userData, token, remember = true) => {
        setAuth(userData, token, remember);
    };

    const logout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common.Authorization;
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginAlt, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
