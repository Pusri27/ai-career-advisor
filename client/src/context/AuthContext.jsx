import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, profileAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const [userRes, profileRes] = await Promise.all([
                authAPI.getMe(),
                profileAPI.get()
            ]);
            setUser(userRes.data.data);
            setProfile(profileRes.data.data);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        setUser(userData);

        // Fetch profile
        const profileRes = await profileAPI.get();
        setProfile(profileRes.data.data);

        return response.data;
    };

    const register = async (name, email, password) => {
        const response = await authAPI.register({ name, email, password });
        const { token, ...userData } = response.data.data;
        localStorage.setItem('token', token);
        setUser(userData);

        // Fetch profile
        const profileRes = await profileAPI.get();
        setProfile(profileRes.data.data);

        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setProfile(null);
    };

    const updateProfile = async (data) => {
        const response = await profileAPI.update(data);
        setProfile(response.data.data);
        return response.data;
    };

    const refreshProfile = async () => {
        const response = await profileAPI.get();
        setProfile(response.data.data);
        return response.data;
    };

    return (
        <AuthContext.Provider value={{
            user,
            profile,
            loading,
            login,
            register,
            logout,
            updateProfile,
            refreshProfile,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
