'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const setAuth = (userObj, token, remember = true) => {
        const nameKey = userObj.username || userObj.name || userObj.firstName || userObj.email || 'User';
        const avatar = ('' + nameKey).charAt(0).toUpperCase();
        const formatted = { ...userObj, avatar };

        if (remember) Cookies.set('token', token, { expires: 30 });
        localStorage.setItem('user', JSON.stringify(formatted));
        setUser(formatted);

        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    };

    useEffect(() => {
        let mounted = true;
        const initAuth = async () => {
            try {
                const token = Cookies.get('token');
                if (!token) {
                    if (mounted) setLoading(false);
                    return;
                }

                const stored = localStorage.getItem('user');
                if (stored) {
                    api.defaults.headers.common.Authorization = `Bearer ${token}`;
                    if (mounted) setUser(JSON.parse(stored));
                    if (mounted) setLoading(false);

                    api.get('/auth/profile').then(({ data }) => {
                        const nameKey = data.username || data.name || data.firstName || data.email || 'User';
                        const avatar = ('' + nameKey).charAt(0).toUpperCase();
                        const formatted = { ...data, avatar };
                        localStorage.setItem('user', JSON.stringify(formatted));
                        if (mounted) setUser(formatted);
                    }).catch(() => {
                        Cookies.remove('token');
                        localStorage.removeItem('user');
                        if (mounted) setUser(null);
                    });
                    return;
                }

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

    const login = ({ user, token }, remember = true) => setAuth(user, token, remember);
    const loginAlt = (userData, token, remember = true) => setAuth(userData, token, remember);
    const updateUser = (payload) => {
        const userData = payload?.user || payload;
        const token = payload?.token || Cookies.get('token');
        setAuth(userData, token, true);
    };

    const logout = () => {
        Cookies.remove('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common.Authorization;
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, loginAlt, updateUser, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
