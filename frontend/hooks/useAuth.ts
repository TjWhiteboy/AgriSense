
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

  useEffect(() => {
    try {
      const storedAuth = localStorage.getItem(AUTH_KEY);
      if (storedAuth) {
        const authData: AuthData = JSON.parse(storedAuth);
        setUser(authData.user);
        setState(authData.state || defaultState);
        setDistrict(authData.district || defaultDistrict);
      }
    } catch (error) {
      console.error("Failed to parse auth data from localStorage", error);
      localStorage.removeItem(AUTH_KEY);
    } finally {
      setIsLoading(false);
    }
  }, [defaultState, defaultDistrict]);

  const login = useCallback((name: string, email: string) => {
    // Determine arbitrary state/district for context if needed, since we dropped them from registration for MVP
    const userState = Object.keys(INDIAN_STATES_DISTRICTS)[0];
    const userDistrict = INDIAN_STATES_DISTRICTS[userState][0];

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
      console.error("Failed to save auth data to localStorage", error);
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(AUTH_KEY);
      localStorage.removeItem("token"); // Remove JWT token
      setUser(null);
    } catch (error) {
      console.error("Failed to remove auth data from localStorage", error);
    }
  }, []);

  return { user, state, district, login, logout, isLoading };
};

export function isAuthenticated() {
  return localStorage.getItem("token") !== null;
}

export const executeLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem(AUTH_KEY);
};

export default useAuth;