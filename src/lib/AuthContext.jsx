import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoadingAuth(true);

      const res = await fetch('/api/auth/user', { credentials: 'include' });

      if (!res.ok) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        return null;
      }

      const data = await res.json();

      const userObj = {
        id: data.id,
        email: data.email,
        full_name: data.full_name || data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        selected_year: data.selected_year || null,
        role: 'user',
      };

      setUser(userObj);
      setIsAuthenticated(true);
      setAuthError(null);
      return userObj;
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
      return null;
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

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError({ type: 'auth_failed', message: data.message });
        return { success: false, message: data.message };
      }

      const userObj = {
        id: data.id,
        email: data.email,
        full_name: data.full_name || data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        selected_year: data.selected_year || null,
        role: 'user',
      };

      setUser(userObj);
      setIsAuthenticated(true);
      setAuthError(null);
      return { success: true, user: userObj };
    } catch (error) {
      const message = error.message || 'Sign in failed';
      setAuthError({ type: 'auth_failed', message });
      return { success: false, message };
    }
  };

  const signUp = async (email, password, fullName, securityQuestion, securityAnswer) => {
    try {
      setAuthError(null);

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
          full_name: fullName,
          security_question: securityQuestion,
          security_answer: securityAnswer,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setAuthError({ type: 'signup_failed', message: data.message });
        return { success: false, message: data.message };
      }

      const userObj = {
        id: data.id,
        email: data.email,
        full_name: data.full_name || data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        selected_year: data.selected_year || null,
        role: 'user',
      };

      setUser(userObj);
      setIsAuthenticated(true);
      setAuthError(null);
      return { success: true, user: userObj };
    } catch (error) {
      const message = error.message || 'Sign up failed';
      setAuthError({ type: 'signup_failed', message });
      return { success: false, message };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const updateMe = async (data) => {
    try {
      const res = await fetch('/api/auth/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        return { success: false, message: err.message };
      }

      const updated = await res.json();
      setUser(prev => ({
        ...prev,
        selected_year: updated.selected_year,
      }));

      return { success: true };
    } catch (error) {
      console.error('Update failed:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = signOut;
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
      signOut,
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
