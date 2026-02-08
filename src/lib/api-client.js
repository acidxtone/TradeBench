/**
 * Smart API Client - Automatically switches between local and Supabase modes
 * Preserves all existing functionality while enabling cloud deployment
 */

import { isSupabaseConfigured, supabase } from './supabase.js';
import { api as localApi } from '../api/localClient.js';
import { api as supabaseApi } from '../api/supabaseClient.js';

// Determine which client to use based on environment
const useSupabase = isSupabaseConfigured && supabase;

// Export the appropriate API client
export const api = useSupabase ? supabaseApi : localApi;

// Export helper for components to check current mode
export const isSupabaseMode = useSupabase;
export const isLocalMode = !useSupabase;

// Log current mode for debugging
console.log(`🔧 API Client: Running in ${useSupabase ? 'Supabase' : 'Local'} mode`);

// Export unified interface for type safety
export const auth = api.auth;
export const entities = api.entities;
export const appLogs = api.appLogs;
export const studyGuides = api.studyGuides;

// Helper to get current user info regardless of mode
export const getCurrentUser = async () => {
  try {
    return await auth.me();
  } catch (error) {
    console.warn('Could not get current user:', error);
    return null;
  }
};

// Helper to check authentication status
export const isAuthenticated = async () => {
  try {
    const user = await getCurrentUser();
    return !!user;
  } catch (error) {
    return false;
  }
};
