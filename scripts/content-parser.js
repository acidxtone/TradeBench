/**
 * Content Parser for Steamfitter/Pipefitter Knowledge Base
 * Extracts and organizes content by year and section
 */

import fs from 'fs';

const knowledgeBasePath = 'C:\\Users\\rmaiv\\Documents\\Steamfitter-Pipefitter info\\guides\\sf-pf-info\\steamfitter-pipefitter-knowledge-base.md';

function readAndParseKnowledgeBase() {
  try {
    const content = fs.readFileSync(knowledgeBasePath, 'utf8');
    
    // Split into manageable chunks for processing
    const chunks = [];
    const chunkSize = 50000; // 50KB chunks
    for (let i = 0; i < content.length; i += chunkSize) {
      chunks.push(content.slice(i, i + chunkSize));
    }
    
    console.log(`Knowledge base loaded: ${content.length} characters in ${chunks.length} chunks`);
    
    // Extract key sections by looking for headers
    const sections = extractSections(content);
    
    // Print available sections for debugging
    console.log('\nAvailable sections in knowledge base:');
    Object.keys(sections).forEach(section => {
      console.log(`- ${section}: ${sections[section].substring(0, 100)}...`);
    });
    
    return sections;
  } catch (error) {
    console.error('Error reading knowledge base:', error);
    return null;
  }
}

function extractSections(content) {
  const sections = {};
  const lines = content.split('\n');
  let currentSection = '';
  let currentContent = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect section headers
    if (line.startsWith('## ')) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      
      // Start new section
      currentSection = line.replace('## ', '').trim();
      currentContent = [];
    } else if (line.startsWith('# ')) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent.join('\n');
      }
      
      // Start new section
      currentSection = line.replace('# ', '').trim();
      currentContent = [];
    } else if (line.trim()) {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent.join('\n');
  }
  
  return sections;
}

// Extract year-specific content using keyword patterns
function extractYearContent(sections, targetYear) {
  const yearPatterns = {
    1: [
      'TRADE ENTRANCE', 'ENTRANCE 1', 'What is a trade entrance exam',
      'Mathematical Formulas', 'Mathematics', 'Barber', 'Construction Craft Labourer',
      'Cluster 1', 'English/Reading Comprehension', 'Science', 'Formulas',
      'Area of a circle', 'circumference', 'πr²', 'pass mark 70%',
      '100 questions', '3 hours', 'PPE', 'hard hats'
    ],
    2: [
      'PERIOD 2', 'SECOND YEAR', 'intermediate', 'basic welding',
      'oxygen is green', 'acetylene is red', 'gas welding', 'portable welding',
      'Metal Fabrication', 'intermediate power tool', 'load signals',
      'intermediate rigging', 'simple offsets', 'metric conversions'
    ],
    3: [
      'PERIOD 3', 'THIRD YEAR', 'advanced', 'confined space entry',
      'load calculations', 'advanced rigging', 'signal coordination',
      'advanced pipe types', 'valve selection', 'system components',
      'rolling offsets', 'compound calculations', 'intermediate trigonometry',
      'complex isometric', 'process flow', 'fabrication details'
    ],
    4: [
      'PERIOD 4', 'FOURTH YEAR', 'journeyman', 'environmental compliance',
      'specialty tools', 'instrumentation', 'preventive maintenance',
      'advanced rigging', 'engineered lifts', 'lift planning',
      'system selection', 'advanced valve applications', 'gasket compatibility',
      'advanced layout calculations', 'P&ID reading', 'compliance documentation'
    ]
  };
  
  const relevantContent = {};
  const patterns = yearPatterns[targetYear];
  
  Object.keys(sections).forEach(sectionName => {
    const sectionContent = sections[sectionName].toLowerCase();
    
    // Check if section contains any year-specific patterns
    const hasRelevantContent = patterns.some(pattern => 
      sectionContent.includes(pattern.toLowerCase())
    );
    
    if (hasRelevantContent) {
      relevantContent[sectionName] = sections[sectionName];
      console.log(`✓ Included section: ${sectionName} (contains year ${targetYear} patterns)`);
    } else {
      console.log(`✗ Excluded section: ${sectionName} (no year ${targetYear} patterns)`);
    }
  });
  
  return relevantContent;
}

// Generate questions based on extracted content
function generateQuestionsFromContent(content, year) {
  const questions = [];
  let questionId = 1;
  
  // Safety questions from content
  const safetyContent = Object.keys(content).find(key => 
    content[key].toLowerCase().includes('safety') || 
    content[key].toLowerCase().includes('ppe') ||
    content[key].toLowerCase().includes('hazard')
  );
  
  if (safetyContent) {
    questions.push({
      id: `y${year}s${String(questionId++).padStart(3, '0')}`,
      year: year,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
      question_text: "What is the primary purpose of a hard hat on a worksite?",
      option_a: "To identify the worker's role",
      option_b: "To protect the head from impact and falling objects",
      option_c: "To hold radios and lights",
      option_d: "To comply with fashion standards",
      correct_answer: "B",
      explanation: "Hard hats are PPE designed to protect the head from impact, falling objects, and electrical shock.",
      reference: "PPE and worksite safety"
    });
    
    questions.push({
      id: `y${year}s${String(questionId++).padStart(3, '0')}`,
      year: year,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
      question_text: "What mark is required to pass the Alberta trade entrance exam?",
      option_a: "50%",
      option_b: "60%",
      option_c: "70%",
      option_d: "80%",
      correct_answer: "C",
      explanation: "A mark of 70% or greater is required to pass the trade entrance exam.",
      reference: "Trade Entrance Exam Study Guide"
    });
  }
  
  // Math questions from content
  const mathContent = Object.keys(content).find(key => 
    content[key].toLowerCase().includes('mathematics') ||
    content[key].toLowerCase().includes('formulas') ||
    content[key].toLowerCase().includes('area of a circle')
  );
  
  if (mathContent) {
    questions.push({
      id: `y${year}s${String(questionId++).padStart(3, '0')}`,
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
        id: `y${year}s${String(questionId++).padStart(3, '0')}`,
        year: year,
        section: 5,
        section_name: "Calculations and Science",
        difficulty: year <= 2 ? 'easy' : year <= 3 ? 'medium' : 'hard',
        question_text: "When a gas is heated it",
        option_a: "expands.",
        option_b: "contracts.",
        option_c: "condenses.",
        option_d: "solidifies.",
        correct_answer: "A",
        explanation: "When a gas is heated it expands. This is a fundamental principle in gas physics.",
        reference: "Science"
      });
    }
  }
  
  // Tools questions
  const toolsContent = Object.keys(content).find(key => 
    content[key].toLowerCase().includes('tools') ||
    content[key].toLowerCase().includes('equipment') ||
    content[key].toLowerCase().includes('pipe cutter')
  );
  
  if (toolsContent) {
    questions.push({
      id: `y${year}s${String(questionId++).padStart(3, '0')}`,
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
  const drawingContent = Object.keys(content).find(key => 
    content[key].toLowerCase().includes('drawing') ||
    content[key].toLowerCase().includes('isometric') ||
    content[key].toLowerCase().includes('blueprint')
  );
  
  if (drawingContent) {
    questions.push({
      id: `y${year}s${String(questionId++).padStart(3, '0')}`,
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

// Main execution
function main() {
  console.log('=== Steamfitter/Pipefitter Content Parser ===\n');
  
  const sections = readAndParseKnowledgeBase();
  if (!sections) {
    console.error('Failed to parse knowledge base');
    return;
  }
  
  console.log(`\nFound ${Object.keys(sections).length} sections\n`);
  
  // Test content extraction for each year
  for (let year = 1; year <= 4; year++) {
    console.log(`\n--- Testing Year ${year} Content Extraction ---`);
    const yearContent = extractYearContent(sections, year);
    const questions = generateQuestionsFromContent(yearContent, year);
    
    console.log(`Year ${year}: Generated ${questions.length} questions`);
    
    // Write year-specific questions file
    const outputPath = `public/data/questions-year-${year}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(questions, null, 2));
    console.log(`Saved: ${outputPath}`);
  }
  
  console.log('\n=== Content parsing complete ===');
}

// Run if called directly
if (process.argv[1]) {
  main();
}

export {
  readAndParseKnowledgeBase,
  extractSections,
  extractYearContent,
  generateQuestionsFromContent
};
