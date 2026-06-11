import { useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService';
import { clearStoredAuth, getStoredAuth, setStoredAuth } from '../utils/storage';
import { AuthContext } from './authContext';

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [booting, setBooting] = useState(Boolean(getStoredAuth()?.token));

  useEffect(() => {
    const hydrate = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth?.token) {
        setBooting(false);
        return;
      }

      try {
        const { data } = await getCurrentUser();
        const nextAuth = { token: storedAuth.token, user: data.user };
        setAuth(nextAuth);
        setStoredAuth(nextAuth);
      } catch {
        clearStoredAuth();
        setAuth(null);
      } finally {
        setBooting(false);
      }
    };

    hydrate();
  }, []);

  const login = async (payload) => {
    const { data } = await loginUser(payload);
    const nextAuth = { token: data.token, user: data.user };
    setStoredAuth(nextAuth);
    setAuth(nextAuth);
    return nextAuth;
  };

  const register = async (payload) => {
    const { data } = await registerUser(payload);
    const nextAuth = { token: data.token, user: data.user };
    setStoredAuth(nextAuth);
    setAuth(nextAuth);
    return nextAuth;
  };

  const logout = () => {
    clearStoredAuth();
    setAuth(null);
  };

  const value = useMemo(() => ({
    user: auth?.user || null,
    token: auth?.token || null,
    isAuthenticated: Boolean(auth?.token),
    booting,
    login,
    register,
    logout,
  }), [auth, booting]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
