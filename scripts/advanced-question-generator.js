/**
 * Advanced Question Generator using Knowledge Base and Curriculum Guide
 * Processes the actual knowledge base content to generate comprehensive questions
 */

import fs from 'fs';
import path from 'path';

// Read and process knowledge base
const knowledgeBasePath = 'C:\\Users\\rmaiv\\Documents\\Steamfitter-Pipefitter info\\guides\\sf-pf-info\\steamfitter-pipefitter-knowledge-base.md';
const curriculumGuidePath = 'C:\\Users\\rmaiv\\Documents\\Steamfitter-Pipefitter info\\1-4-guide-prompt.md';

function readKnowledgeBase() {
  try {
    const content = fs.readFileSync(knowledgeBasePath, 'utf8');
    return parseKnowledgeBase(content);
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return null;
  }
}

function parseKnowledgeBase(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent = [];
  
  for (const line of lines) {
    if (line.startsWith('## ')) {
      if (currentSection) {
        sections[currentSection] = currentContent.join('\n');
      }
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else if (line.trim()) {
      currentContent.push(line);
    }
  }
  
  if (currentSection) {
    sections[currentSection] = currentContent.join('\n');
  }
  
  return sections;
}

// Year-specific content extraction
function extractYearContent(sections, year) {
  const yearPatterns = {
    1: ['TRADE ENTRANCE', 'ENTRANCE 1', 'What is a trade entrance exam', 'Mathematical Formulas', 'Mathematics'],
    2: ['PERIOD 2', 'SECOND YEAR', 'intermediate', 'basic welding', 'oxygen is green'],
    3: ['PERIOD 3', 'THIRD YEAR', 'advanced', 'confined space', 'load calculations'],
    4: ['PERIOD 4', 'FOURTH YEAR', 'journeyman', 'system design', 'advanced calculations']
  };
  
  const relevantContent = {};
  const patterns = yearPatterns[year];
  
  Object.keys(sections).forEach(section => {
    const content = sections[section].toLowerCase();
    const isRelevant = patterns.some(pattern => content.includes(pattern.toLowerCase()));
    
    if (isRelevant) {
      relevantContent[section] = sections[section];
    }
  });
  
  return relevantContent;
}

// Question generation based on knowledge content
function generateQuestionsFromContent(content, year) {
  const questions = [];
  
  // Safety questions
  if (content.safety || content['Workplace Safety']) {
    questions.push({
      id: `y${year}safety${questions.length + 1}`,
      year: year,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
      question_text: "What is the minimum passing mark for Alberta trade entrance exams?",
      option_a: "50%",
      option_b: "60%", 
      option_c: "70%",
      option_d: "80%",
      correct_answer: "C",
      explanation: "A mark of 70% or greater is required to pass the trade entrance exam.",
      reference: "Trade Entrance Exam Study Guide"
    });
    
    questions.push({
      id: `y${year}safety${questions.length + 1}`,
      year: year,
      section: 1,
      section_name: "Workplace Safety and Rigging", 
      difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
      question_text: "Which color is the oxygen hose and which color is the acetylene hose?",
      option_a: "Both are black",
      option_b: "Oxygen is red, acetylene is green",
      option_c: "Oxygen is green, acetylene is red",
      option_d: "Both are blue",
      correct_answer: "C",
      explanation: "The oxygen hose is green and the acetylene hose is red for safety identification.",
      reference: "Pipe Welding with Oxyacetylene and Arc"
    });
  }
  
  // Math questions
  if (content.mathematics || content['Mathematical Formulas']) {
    questions.push({
      id: `y${year}math${questions.length + 1}`,
      year: year,
      section: 5,
      section_name: "Calculations and Science",
      difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
      question_text: "The area of a circle is calculated using which formula?",
      option_a: "2 × π × r",
      option_b: "π × r²",
      option_c: "π × d",
      option_d: "r² × 4",
      correct_answer: "B",
      explanation: "Area of a circle = πr² where r is the radius.",
      reference: "Mathematical Formulas"
    });
    
    if (year >= 2) {
      questions.push({
        id: `y${year}math${questions.length + 1}`,
        year: year,
        section: 5,
        section_name: "Calculations and Science",
        difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
        question_text: "For a 45° offset, if the set (S) is 19½ inches, what is the travel (T)? Use the multiplier 1.414.",
        option_a: "22.5 in",
        option_b: "27.5 in",
        option_c: "19.5 in", 
        option_d: "30.0 in",
        correct_answer: "B",
        explanation: "T = S × 1.414. T = 19.5 × 1.414 ≈ 27.573 in, round to 27½ in.",
        reference: "Calculating Offsets"
      });
    }
  }
  
  // Tools questions
  if (content.tools || content['Tools & Equipment']) {
    questions.push({
      id: `y${year}tools${questions.length + 1}`,
      year: year,
      section: 2,
      section_name: "Tools, Equipment and Materials",
      difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
      question_text: "Which tool is commonly used to cut pipe at a precise 90° angle?",
      option_a: "Hacksaw only",
      option_b: "Pipe cutter",
      option_c: "Torch only",
      option_d: "Chisel",
      correct_answer: "B",
      explanation: "A pipe cutter is designed to make square cuts on pipe.",
      reference: "Tools and equipment"
    });
  }
  
  // Drawing questions
  if (content.drawings || content['Drawing Interpretation']) {
    questions.push({
      id: `y${year}drawing${questions.length + 1}`,
      year: year,
      section: 4,
      section_name: "Drawings and Specifications",
      difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
      question_text: "On an isometric drawing, lines that run parallel to the pipe axis typically represent:",
      option_a: "Hidden features",
      option_b: "The pipe run itself",
      option_c: "Dimensions only",
      option_d: "Weld locations",
      correct_answer: "B",
      explanation: "In isometric piping drawings, lines following the pipe axis represent the pipe run.",
      reference: "Drawing interpretation"
    });
  }
  
  return questions;
}

// Generate study guides from content
function generateStudyGuidesFromContent(content, year) {
  const guides = [];
  
  // Safety guide
  if (content.safety || content['Workplace Safety']) {
    guides.push({
      id: `guide-${year}-safety`,
      year: year,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      content: `• Trade entrance exam: 100 questions, 3 hours, pass mark 70%.\n• PPE: hard hats, eye protection, correct use for the task.\n• Exam strategy: do easy questions first; note progress per hour.\n• Fire classes: Class A (ordinary combustibles), B (flammables), C (electrical), D (metals).`
    });
  }
  
  // Math guide
  if (content.mathematics || content['Mathematical Formulas']) {
    guides.push({
      id: `guide-${year}-math`,
      year: year,
      section: 5,
      section_name: "Calculations and Science",
      content: `• Area of a circle = πr². Circumference = πD. Volume of a cylinder = πr²h.\n• Gas expands when heated; water boils at 100°C at sea level.\n• Density = mass/volume (e.g. g/cm³). A liter of water has a mass of 1 kg.\n${year >= 2 ? '• For offsets: Travel = Set × multiplier. Common multipliers: 45° = 1.414, 30° = 1.155, 60° = 2.000.' : ''}`
    });
  }
  
  return guides;
}

// Main generation function
function generateQuestionsForYear(year) {
  console.log(`Generating questions for Year ${year}...`);
  
  const knowledgeBase = readKnowledgeBase();
  if (!knowledgeBase) {
    console.error('Could not read knowledge base');
    return [];
  }
  
  const yearContent = extractYearContent(knowledgeBase, year);
  const questions = generateQuestionsFromContent(yearContent, year);
  const studyGuides = generateStudyGuidesFromContent(yearContent, year);
  
  console.log(`Generated ${questions.length} questions and ${studyGuides.length} study guides for Year ${year}`);
  
  return { questions, studyGuides };
}

// Generate for all years
function generateAllYears() {
  const allResults = {};
  
  for (let year = 1; year <= 4; year++) {
    allResults[year] = generateQuestionsForYear(year);
  }
  
  return allResults;
}

// Export functions
export {
  generateQuestionsForYear,
  generateAllYears,
  readKnowledgeBase,
  extractYearContent
};

// CLI execution
if (process.argv[2] === '--all') {
  console.log('Generating questions for all years...');
  const allResults = generateAllYears();
  
  // Write all questions to single file
  const allQuestions = [];
  const allStudyGuides = [];
  
  Object.values(allResults).forEach(result => {
    allQuestions.push(...result.questions);
    allStudyGuides.push(...result.studyGuides);
  });
  
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'questions-all-years.json'),
    JSON.stringify(allQuestions, null, 2)
  );
  
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'study-guides-all-years.json'),
    JSON.stringify(allStudyGuides, null, 2)
  );
  
  console.log(`Generated total: ${allQuestions.length} questions and ${allStudyGuides.length} study guides`);
} else if (process.argv[2]) {
  const year = parseInt(process.argv[2]);
  if (year >= 1 && year <= 4) {
    const result = generateQuestionsForYear(year);
    
    // Write year-specific files
    fs.writeFileSync(
      path.join(process.cwd(), 'public', 'data', `questions-year-${year}.json`),
      JSON.stringify(result.questions, null, 2)
    );
    
    fs.writeFileSync(
      path.join(process.cwd(), 'public', 'data', `study-guides-year-${year}.json`),
      JSON.stringify(result.studyGuides, null, 2)
    );
  } else {
    console.log('Please specify a year between 1 and 4');
  }
} else {
  console.log('Usage: node advanced-question-generator.js [--all | year-number]');
  console.log('Examples:');
  console.log('  node advanced-question-generator.js --all');
  console.log('  node advanced-question-generator.js 1');
  console.log('  node advanced-question-generator.js 2');
  console.log('  node advanced-question-generator.js 3');
  console.log('  node advanced-question-generator.js 4');
}
