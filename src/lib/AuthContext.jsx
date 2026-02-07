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
      
      // Get current session from Supabase
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        return null;
      }
      
      if (!session?.user) {
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        return null;
      }
      
      // Get user profile from database
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', session.user.email)
        .single();
        
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        return null;
      }
      
      const userObj = {
        id: profileData.id,
        email: session.user.email,
        full_name: profileData.full_name || [profileData.first_name, profileData.last_name].filter(Boolean).join(' ') || session.user.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        profile_image_url: profileData.profile_image_url,
        selected_year: profileData.selected_year || null,
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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setAuthError({ type: 'auth_failed', message: error.message });
        return { success: false, message: error.message };
      }
      
      if (!data.user) {
        setAuthError({ type: 'auth_failed', message: 'Login failed' });
        return { success: false, message: 'Login failed' };
      }
      
      // Get or create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: data.user.email,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'merge'
        })
        .select()
        .single();
        
      if (profileError) {
        console.error('Profile creation error:', profileError);
        setAuthError({ type: 'profile_failed', message: profileError.message });
        return { success: false, message: profileError.message };
      }
      
      const userObj = {
        id: profileData.id,
        email: data.user.email,
        full_name: profileData.full_name || data.user.email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        profile_image_url: profileData.profile_image_url,
        selected_year: profileData.selected_year || null,
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            security_question: securityQuestion,
            security_answer: securityAnswer
          }
        }
      });
      
      if (error) {
        setAuthError({ type: 'signup_failed', message: error.message });
        return { success: false, message: error.message };
      }
      
      if (!data.user) {
        setAuthError({ type: 'signup_failed', message: 'Registration failed' });
        return { success: false, message: 'Registration failed' };
      }
      
      // Create user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (profileError) {
        console.error('Profile creation error:', profileError);
        setAuthError({ type: 'profile_failed', message: profileError.message });
        return { success: false, message: profileError.message };
      }
      
      const userObj = {
        id: profileData.id,
        email: data.user.email,
        full_name: fullName,
        first_name: fullName.split(' ')[0] || '',
        last_name: fullName.split(' ').slice(1).join(' ') || '',
        profile_image_url: profileData.profile_image_url,
        selected_year: profileData.selected_year || null,
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
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      setAuthError(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateMe = async (data) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          selected_year: data.selected_year,
          updated_at: new Date().toISOString()
        })
        .eq('email', user?.email);
        
      if (error) {
        console.error('Profile update error:', error);
        return { success: false, message: error.message };
      }
      
      // Update local user state
      setUser(prev => ({
        ...prev,
        selected_year: data.selected_year
      }));
      
      return { success: true };
    } catch (error) {
      console.error('Update failed:', error);
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch (_) {}
    setUser(null);
    setIsAuthenticated(false);
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
