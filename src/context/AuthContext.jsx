import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChange, checkAdminClaim, logout as authLogout } from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Проверка за admin права без принудително обновяване (по-бързо)
        // Force refresh само при първоначално зареждане или при нужда
        try {
          const adminStatus = await checkAdminClaim();
          if (isMounted) {
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error('Error checking admin:', error);
          if (isMounted) {
            setIsAdmin(false);
          }
        }
      } else {
        if (isMounted) {
          setUser(null);
          setIsAdmin(false);
        }
      }
      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const logout = async () => {
    await authLogout();
    setUser(null);
    setIsAdmin(false);
  };

  const value = {
    user,
    isAdmin,
    loading,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

