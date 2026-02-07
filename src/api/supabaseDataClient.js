/**
 * Supabase Data Client - Questions, Study Guides, User Progress
 * Replaces localClient.js with Supabase database operations
 */

import { supabase } from './supabaseClient';

// Questions API
export const questionsApi = {
  getAll: async (year = null) => {
    try {
      let query = supabase.from('questions').select('*');
      
      if (year) {
        query = query.eq('year', year);
      }
      
      const { data, error } = await query.order('year', { ascending: true });
      
      if (error) throw error;
      
      // Transform to match expected format
      return data.map(q => ({
        id: q.id,
        year: q.year,
        section: q.section,
        section_name: q.section,
        difficulty: q.difficulty,
        question_text: q.question_text,
        option_a: q.options?.a || '',
        option_b: q.options?.b || '',
        option_c: q.options?.c || '',
        option_d: q.options?.d || '',
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        reference: q.reference || 'AIT Curriculum'
      }));
    } catch (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
  },

  getByYear: async (year) => {
    return questionsApi.getAll(year);
  },

  getBySection: async (year, section) => {
    try {
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('year', year)
        .eq('section', section)
        .order('id');
      
      if (error) throw error;
      
      return data.map(q => ({
        id: q.id,
        year: q.year,
        section: q.section,
        section_name: q.section,
        difficulty: q.difficulty,
        question_text: q.question_text,
        option_a: q.options?.a || '',
        option_b: q.options?.b || '',
        option_c: q.options?.c || '',
        option_d: q.options?.d || '',
        correct_answer: q.correct_answer,
        explanation: q.explanation,
        reference: q.reference || 'AIT Curriculum'
      }));
    } catch (error) {
      console.error('Error fetching questions by section:', error);
      return [];
    }
  }
};

// Study Guides API
export const studyGuidesApi = {
  getAll: async (year = null) => {
    try {
      let query = supabase.from('study_guides').select('*');
      
      if (year) {
        query = query.eq('year', year);
      }
      
      const { data, error } = await query.order('year', { ascending: true });
      
      if (error) throw error;
      
      return data.map(guide => ({
        id: guide.id,
        year: guide.year,
        section: guide.section,
        section_name: guide.section,
        title: guide.title,
        content: guide.content,
        created_at: guide.created_at,
        updated_at: guide.updated_at
      }));
    } catch (error) {
      console.error('Error fetching study guides:', error);
      return [];
    }
  },

  getByYear: async (year) => {
    return studyGuidesApi.getAll(year);
  },

  getBySection: async (year, section) => {
    try {
      const { data, error } = await supabase
        .from('study_guides')
        .select('*')
        .eq('year', year)
        .eq('section', section)
        .order('title');
      
      if (error) throw error;
      
      return data.map(guide => ({
        id: guide.id,
        year: guide.year,
        section: guide.section,
        section_name: guide.section,
        title: guide.title,
        content: guide.content,
        created_at: guide.created_at,
        updated_at: guide.updated_at
      }));
    } catch (error) {
      console.error('Error fetching study guides by section:', error);
      return [];
    }
  }
};

// User Progress API
export const userProgressApi = {
  get: async (userId, year) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .single();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error;
      }
      
      return data || {
        id: null,
        user_id: userId,
        year: year,
        progress_data: {},
        exam_readiness: {},
        statistics: {},
        bookmarks: [],
        weak_areas: [],
        streak_data: {}
      };
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  },

  update: async (userId, year, progressData) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: userId,
          year: year,
          progress_data: progressData.progress_data || {},
          exam_readiness: progressData.exam_readiness || {},
          statistics: progressData.statistics || {},
          bookmarks: progressData.bookmarks || [],
          weak_areas: progressData.weak_areas || [],
          streak_data: progressData.streak_data || {},
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  },

  updateStatistics: async (userId, year, statistics) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .update({
          statistics: statistics,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('year', year)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating user statistics:', error);
      throw error;
    }
  }
};

// Quiz Sessions API
export const quizSessionsApi = {
  create: async (sessionData) => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .insert(sessionData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating quiz session:', error);
      throw error;
    }
  },

  update: async (sessionId, updateData) => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating quiz session:', error);
      throw error;
    }
  },

  getUserSessions: async (userId, year, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('quiz_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('year', year)
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user quiz sessions:', error);
      return [];
    }
  }
};

// Bookmarks API
export const bookmarksApi = {
  add: async (userId, questionId, year) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          question_id: questionId,
          year: year
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding bookmark:', error);
      throw error;
    }
  },

  remove: async (userId, questionId) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('question_id', questionId);
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing bookmark:', error);
      throw error;
    }
  },

  getUserBookmarks: async (userId, year) => {
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select(`
          *,
          questions (*)
        `)
        .eq('user_id', userId)
        .eq('year', year)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user bookmarks:', error);
      return [];
    }
  }
};

// Combined API object (maintains compatibility with existing code)
export const api = {
  entities: {
    Question: {
      filter: async (filters) => {
        if (filters.year) {
          return questionsApi.getByYear(filters.year);
        }
        return questionsApi.getAll();
      }
    },
    StudyGuide: {
      filter: async (filters) => {
        if (filters.year) {
          return studyGuidesApi.getByYear(filters.year);
        }
        return studyGuidesApi.getAll();
      }
    },
    UserProgress: {
      filter: async (filters) => {
        const progress = await userProgressApi.get(filters.created_by, filters.year);
        return progress ? [progress] : [];
      }
    }
  },
  questions: questionsApi,
  studyGuides: studyGuidesApi,
  userProgress: userProgressApi,
  quizSessions: quizSessionsApi,
  bookmarks: bookmarksApi
};

export default api;
