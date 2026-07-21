
import { useState, useEffect, useCallback } from 'react';
import type { User } from '../types';
import { INDIAN_STATES_DISTRICTS } from '../constants';

const AUTH_KEY = 'agriSenseAuth';

interface AuthData {
  user: User;
  state: string;
  district: string;
}

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const defaultState = Object.keys(INDIAN_STATES_DISTRICTS)[0];
  const defaultDistrict = INDIAN_STATES_DISTRICTS[defaultState][0];

  const [state, setState] = useState<string>(defaultState);
  const [district, setDistrict] = useState<string>(defaultDistrict);

  // On mount: restore session from JWT via GET /api/profile
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        // Check old localStorage fallback
        try {
          const storedAuth = localStorage.getItem(AUTH_KEY);
          if (storedAuth) {
            const authData: AuthData = JSON.parse(storedAuth);
            setUser(authData.user);
            setState(authData.state || defaultState);
            setDistrict(authData.district || defaultDistrict);
          }
        } catch (_) {
          localStorage.removeItem(AUTH_KEY);
        }
        setIsLoading(false);
        return;
      }

      // Token exists — fetch real profile from backend
      try {
        const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
        const API = BASE.endsWith('/api') ? BASE : `${BASE}/api`;
        const res = await fetch(`${API}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const profile = await res.json();
          const userData: User = { name: profile.name, email: profile.email };
          setUser(userData);
          setState(profile.state || defaultState);
          setDistrict(profile.district || defaultDistrict);
          // Keep localStorage in sync
          const authData: AuthData = { user: userData, state: profile.state || defaultState, district: profile.district || defaultDistrict };
          localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
        } else {
          // Token invalid — clear it
          localStorage.removeItem('token');
          localStorage.removeItem(AUTH_KEY);
        }
      } catch (_) {
        // Network failure — use cached auth if available
        try {
          const storedAuth = localStorage.getItem(AUTH_KEY);
          if (storedAuth) {
            const authData: AuthData = JSON.parse(storedAuth);
            setUser(authData.user);
            setState(authData.state || defaultState);
            setDistrict(authData.district || defaultDistrict);
          }
        } catch (__) {}
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback((name: string, email: string, profileState?: string, profileDistrict?: string) => {
    const userState = profileState || Object.keys(INDIAN_STATES_DISTRICTS)[0];
    const userDistrict = profileDistrict || INDIAN_STATES_DISTRICTS[userState][0];

    const authData: AuthData = {
      user: { name, email },
      state: userState,
      district: userDistrict,
    };
    try {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      setUser(authData.user);
      setState(authData.state);
      setDistrict(authData.district);
    } catch (error) {
      console.error('Failed to save auth data to localStorage', error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem('token');
      setUser(null);
      setState(defaultState);
      setDistrict(defaultDistrict);
    } catch (error) {
      console.error('Failed to remove auth data from localStorage', error);
    }
  }, [defaultState, defaultDistrict]);

  return { user, state, district, login, logout, isLoading };
};

export function isAuthenticated() {
  return localStorage.getItem('token') !== null;
}

export const executeLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem(AUTH_KEY);
};

export default useAuth;