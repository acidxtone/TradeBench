import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const STORAGE_KEYS = {
  selectedYear: 'tradebench_selected_year',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings] = useState({ id: 'replit', public_settings: {} });

  const fetchUser = async () => {
    try {
      setIsLoadingAuth(true);
      const response = await fetch('/api/auth/user', { credentials: 'include' });

      if (response.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }

      const userData = await response.json();
      const selectedYear = parseInt(localStorage.getItem(STORAGE_KEYS.selectedYear), 10);

      setUser({
        id: userData.id,
        email: userData.email,
        full_name: [userData.firstName, userData.lastName].filter(Boolean).join(' ') || userData.email || 'User',
        first_name: userData.firstName,
        last_name: userData.lastName,
        profile_image_url: userData.profileImageUrl,
        selected_year: Number.isFinite(selectedYear) ? selectedYear : null,
        role: 'user',
      });
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } finally {
      setIsLoadingAuth(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const updateMe = async (data) => {
    try {
      if (data.selected_year != null) {
        localStorage.setItem(STORAGE_KEYS.selectedYear, String(data.selected_year));
      }
      setUser(prev => prev ? { ...prev, ...data } : prev);
      return { success: true };
    } catch (error) {
      console.error('Update profile failed:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    window.location.href = '/api/logout';
  };

  const navigateToLogin = () => {
    window.location.href = '/api/login';
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings,
      authError,
      appPublicSettings,
      anonymousSessionData: null,
      logout,
      navigateToLogin,
      checkAppState: fetchUser,
      updateMe,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
