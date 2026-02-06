import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const STORAGE_KEYS = {
  selectedYear: 'tradebench_selected_year',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUser = useCallback(async () => {
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
        full_name: userData.fullName || [userData.firstName, userData.lastName].filter(Boolean).join(' ') || userData.email,
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
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = async (email, password) => {
    try {
      setAuthError(null);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError({ type: 'auth_failed', message: data.message });
        return { success: false, message: data.message };
      }

      await fetchUser();
      return { success: true };
    } catch (error) {
      const message = error.message || 'Sign in failed';
      setAuthError({ type: 'auth_failed', message });
      return { success: false, message };
    }
  };

  const signUp = async (email, password, fullName, securityQuestion, securityAnswer) => {
    try {
      setAuthError(null);
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password, fullName, securityQuestion, securityAnswer }),
      });

      const data = await response.json();

      if (!response.ok) {
        setAuthError({ type: 'signup_failed', message: data.message });
        return { success: false, message: data.message };
      }

      await fetchUser();
      return { success: true };
    } catch (error) {
      const message = error.message || 'Sign up failed';
      setAuthError({ type: 'signup_failed', message });
      return { success: false, message };
    }
  };

  const updateMe = async (data) => {
    try {
      if (data.selected_year != null) {
        localStorage.setItem(STORAGE_KEYS.selectedYear, String(data.selected_year));
      }
      setUser(prev => prev ? { ...prev, ...data } : prev);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.selectedYear);
  };

  const navigateToLogin = () => {};

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      appPublicSettings: { id: 'custom', public_settings: {} },
      anonymousSessionData: null,
      logout,
      navigateToLogin,
      checkAppState: fetchUser,
      signIn,
      signUp,
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
