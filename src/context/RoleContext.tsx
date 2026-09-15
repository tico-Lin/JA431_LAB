import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { ROLE_HASHES } from '../config/roles';
import type { Role } from '../config/roles';
import { sha256 } from '../utils/crypto';

interface RoleContextType {
  role: Role;
  loginWithKey: (key: string) => Promise<boolean>;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

export const RoleProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<Role>('guest');

  useEffect(() => {
    // Check URL parameters for hash first
    const params = new URLSearchParams(window.location.search);
    const urlHash =
      params.get('key') || params.get('token') || params.get('access');
    const now = Date.now();

    if (urlHash && ROLE_HASHES[urlHash]) {
      const newRole = ROLE_HASHES[urlHash];
      setRole(newRole);
      localStorage.setItem('ja431_user_role', urlHash);
      localStorage.setItem('ja431_user_loginAt', now.toString());
      // Clean up URL without triggering a page reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
      return;
    }

    // Check localStorage
    const savedHash = localStorage.getItem('ja431_user_role');
    const loginAt = localStorage.getItem('ja431_user_loginAt');

    if (savedHash && ROLE_HASHES[savedHash] && loginAt) {
      const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
      if (now - parseInt(loginAt, 10) < SEVEN_DAYS_MS) {
        setRole(ROLE_HASHES[savedHash]);
      } else {
        // Expired
        localStorage.removeItem('ja431_user_role');
        localStorage.removeItem('ja431_user_loginAt');
      }
    }
  }, []);

  const loginWithKey = async (plainTextKey: string): Promise<boolean> => {
    const hash = await sha256(plainTextKey);
    if (ROLE_HASHES[hash]) {
      const newRole = ROLE_HASHES[hash];
      setRole(newRole);
      localStorage.setItem('ja431_user_role', hash);
      localStorage.setItem('ja431_user_loginAt', Date.now().toString());
      return true;
    }
    return false;
  };

  const logout = () => {
    setRole('guest');
    localStorage.removeItem('ja431_user_role');
    localStorage.removeItem('ja431_user_loginAt');
  };

  return (
    <RoleContext.Provider value={{ role, loginWithKey, logout }}>
      {children}
    </RoleContext.Provider>
  );
};
