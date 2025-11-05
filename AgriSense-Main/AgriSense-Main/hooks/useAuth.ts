
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

  const login = useCallback((name: string, userState: string, userDistrict: string) => {
    const authData: AuthData = { 
        user: { name }, 
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
      setUser(null);
    } catch (error) {
      console.error("Failed to remove auth data from localStorage", error);
    }
  }, []);

  return { user, state, district, login, logout, isLoading };
};

export default useAuth;