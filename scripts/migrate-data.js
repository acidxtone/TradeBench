/**
 * Data migration script to populate Supabase with existing questions and study guides
 * Run this script after setting up your Supabase project
 */

import { createClient } from '@supabase/supabase-js';
import questionsData from '../public/data/questions.json';
import studyGuidesData from '../public/data/study-guides.json';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function migrateQuestions() {
  console.log('Migrating questions...');
  
  try {
    const { data, error } = await supabase
      .from('questions')
      .upsert(questionsData, {
        onConflict: 'id'
      })
      .select();

    if (error) {
      console.error('Error migrating questions:', error);
      return false;
    }

    console.log(`Successfully migrated ${data?.length || 0} questions`);
    return true;
  } catch (error) {
    console.error('Error migrating questions:', error);
    return false;
  }
}

async function migrateStudyGuides() {
  console.log('Migrating study guides...');
  
  try {
    const { data, error } = await supabase
      .from('study_guides')
      .upsert(studyGuidesData, {
        onConflict: 'id'
      })
      .select();

    if (error) {
      console.error('Error migrating study guides:', error);
      return false;
    }

    console.log(`Successfully migrated ${data?.length || 0} study guides`);
    return true;
  } catch (error) {
    console.error('Error migrating study guides:', error);
    return false;
  }
}

async function runMigration() {
  console.log('Starting data migration...');
  
  // Update these with your actual Supabase credentials
  if (supabaseUrl === 'YOUR_SUPABASE_URL' || supabaseAnonKey === 'YOUR_SUPABASE_ANON_KEY') {
    console.error('Please update the Supabase URL and anon key in this script');
    process.exit(1);
  }

  const questionsSuccess = await migrateQuestions();
  const studyGuidesSuccess = await migrateStudyGuides();

  if (questionsSuccess && studyGuidesSuccess) {
    console.log('Migration completed successfully!');
  } else {
    console.error('Migration failed. Please check the errors above.');
    process.exit(1);
  }
}

// Run the migration
runMigration().catch(console.error);
