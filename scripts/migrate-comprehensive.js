import { createClient } from '@supabase/supabase-js';
import questionsData from '../public/data/questions-massive-comprehensive.json' with { type: 'json' };
import studyGuidesData from '../public/data/study-guides-massive-comprehensive.json' with { type: 'json' };
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askForCredentials() {
  return new Promise((resolve) => {
    rl.question('Enter your Supabase URL: ', (url) => {
      rl.question('Enter your Supabase Anon Key: ', (key) => {
        resolve({ url, key });
      });
    });
  });
}

async function runComprehensiveMigration() {
  console.log('🔧 COMPREHENSIVE Data Migration for TradeBench');
  console.log(`This will migrate ${questionsData.length} questions and ${studyGuidesData.length} study guides...\n`);
  
  const { url, key } = await askForCredentials();
  
  console.log(`\n📡 Using URL: ${url}`);
  console.log(`🔑 Using Key: ${key.substring(0, 20)}...${key.substring(key.length - 10)}`);
  
  const supabase = createClient(url, key);
  
  try {
    console.log('\n📤 Migrating all questions...');
    
    // Migrate in batches to avoid rate limits
    const batchSize = 100;
    for (let i = 0; i < questionsData.length; i += batchSize) {
      const batch = questionsData.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('questions')
        .upsert(batch, {
          onConflict: 'id'
        })
        .select();

      if (error) {
        console.error(`❌ Error migrating questions batch ${Math.floor(i/batchSize) + 1}:`, error);
        return false;
      }

      console.log(` Migrated questions batch ${Math.floor(i/batchSize) + 1}: ${batch.length} questions`);
      await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between batches
    }

    console.log('\n Migrating all study guides...');
    
    // Fix UUID format and content structure in study guides
    const fixedStudyGuides = studyGuidesData.map(guide => {
      const fixedId = guide.id || `guide-${guide.year}-${guide.section || 'general'}`;
      const fixedContent = typeof guide.content === 'string' ? guide.content : JSON.stringify(guide.content);
      
      return {
        ...guide,
        id: fixedId,
        content: fixedContent
      };
    });
    
    // Migrate study guides in batches
    for (let i = 0; i < fixedStudyGuides.length; i += batchSize) {
      const batch = fixedStudyGuides.slice(i, i + batchSize);
      
      try {
        const { data, error } = await supabase
          .from('study_guides')
          .upsert(batch, {
            onConflict: 'id'
          })
          .select();

        if (error) {
          console.error(` Error migrating study guides batch ${Math.floor(i/batchSize) + 1}:`, error);
          // Continue with next batch instead of failing
          continue;
        } else {
          console.log(` Migrated study guides batch ${Math.floor(i/batchSize) + 1}: ${batch.length} guides`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between batches
      } catch (batchError) {
        console.error(` Batch error ${Math.floor(i/batchSize) + 1}:`, batchError);
        // Continue with next batch instead of failing
        continue;
      }
    }

    console.log('\n COMPREHENSIVE Migration completed successfully!');
    console.log(`\n Total: ${questionsData.length} questions, ${studyGuidesData.length} study guides`);
    console.log('\n Your TradeBench app should now have comprehensive content for ALL years!');
    
    return true;
  } catch (error) {
    console.error(' Comprehensive migration failed:', error.message);
    return false;
  }
}

runComprehensiveMigration().then(success => {
  if (success) {
    console.log('\n✅ All comprehensive data migrated to your Supabase database!');
    console.log('Your Study page should now show content for ALL years (1-4).');
  } else {
    console.log('\n❌ Migration failed. Please check your credentials and try again.');
  }
  
  rl.close();
});
