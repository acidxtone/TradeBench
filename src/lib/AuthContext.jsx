import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { auth, getCurrentUser, isSupabaseMode } from '@/lib/api-client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState(null);

  const fetchUser = useCallback(async () => {
    try {
      setIsLoadingAuth(true);

      const data = await getCurrentUser();

      if (!data) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        return null;
      }

      const userObj = {
        id: data.id,
        email: data.email,
        full_name: data.full_name || data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        selected_year: data.selected_year || null,
        role: data.role || 'user',
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

      const data = await auth.signIn(email, password);

      if (!data.user) {
        setAuthError({ type: 'auth_failed', message: data.message || 'Sign in failed' });
        return { success: false, message: data.message || 'Sign in failed' };
      }

      const userObj = {
        id: data.user.id || data.id,
        email: data.user.email || data.email,
        full_name: data.user.full_name || data.user.email || data.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        selected_year: data.user.selected_year || data.selected_year || null,
        role: data.user.role || data.role || 'user',
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

      // For Supabase mode, we don't use security questions
      const data = isSupabaseMode 
        ? await auth.signUp(email, password, fullName)
        : await auth.signUp(email, password, fullName, securityQuestion, securityAnswer);

      if (!data.user) {
        setAuthError({ type: 'signup_failed', message: data.message || 'Sign up failed' });
        return { success: false, message: data.message || 'Sign up failed' };
      }

      const userObj = {
        id: data.user.id || data.id,
        email: data.user.email || data.email,
        full_name: data.user.full_name || data.user.email || data.email,
        first_name: data.user.first_name,
        last_name: data.user.last_name,
        selected_year: data.user.selected_year || data.selected_year || null,
        role: data.user.role || data.role || 'user',
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
      await auth.logout();
    } catch (_) {}
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
  };

  const updateMe = async (data) => {
    try {
      const updated = await auth.updateMe(data);
      
      if (updated) {
        setUser(prev => ({
          ...prev,
          selected_year: updated.selected_year,
        }));
        return { success: true };
      } else {
        return { success: false, message: 'Update failed' };
      }
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
