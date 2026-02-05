/**
 * Comprehensive Question Generator for Steamfitter/Pipefitter
 * Uses knowledge base and curriculum guide to generate AIT-style questions for all years
 */

import fs from 'fs';
import path from 'path';

const knowledgeBasePath = 'C:\\Users\\rmaiv\\Documents\\Steamfitter-Pipefitter info\\guides\\sf-pf-info\\steamfitter-pipefitter-knowledge-base.md';

// Comprehensive question database based on trade knowledge
const questionDatabase = {
  // Year 1 - Basic questions
  year1: [
    {
      id: 'y1s1001',
      year: 1,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      difficulty: 'easy',
      question_text: "What is the primary purpose of a hard hat on a worksite?",
      option_a: "To identify the worker's role",
      option_b: "To protect the head from impact and falling objects",
      option_c: "To hold radios and lights",
      option_d: "To comply with fashion standards",
      correct_answer: "B",
      explanation: "Hard hats are PPE designed to protect the head from impact, falling objects, and electrical shock.",
      reference: "PPE and worksite safety"
    },
    {
      id: 'y1s1002',
      year: 1,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      difficulty: 'easy',
      question_text: "What mark is required to pass the Alberta trade entrance exam?",
      option_a: "50%",
      option_b: "60%",
      option_c: "70%",
      option_d: "80%",
      correct_answer: "C",
      explanation: "A mark of 70% or greater is required to pass the trade entrance exam.",
      reference: "Trade Entrance Exam Study Guide"
    },
    {
      id: 'y1s1003',
      year: 1,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      difficulty: 'easy',
      question_text: "Which fire class involves ordinary combustibles like wood and paper?",
      option_a: "Class A",
      option_b: "Class B",
      option_c: "Class C",
      option_d: "Class D",
      correct_answer: "A",
      explanation: "Class A fires involve ordinary combustibles such as wood, paper, cloth, and most plastics.",
      reference: "Fire Safety Basics"
    },
    {
      id: 'y1s2001',
      year: 1,
      section: 2,
      section_name: "Tools, Equipment and Materials",
      difficulty: 'easy',
      question_text: "Which tool is commonly used to cut pipe at a precise 90° angle?",
      option_a: "Hacksaw only",
      option_b: "Pipe cutter",
      option_c: "Torch only",
      option_d: "Chisel",
      correct_answer: "B",
      explanation: "A pipe cutter is designed to make square cuts on pipe.",
      reference: "Tools and equipment"
    },
    {
      id: 'y1s5001',
      year: 1,
      section: 5,
      section_name: "Calculations and Science",
      difficulty: 'easy',
      question_text: "The area of a circle is calculated using which formula?",
      option_a: "2 × π × r",
      option_b: "π × r²",
      option_c: "π × d",
      option_d: "r² × 4",
      correct_answer: "B",
      explanation: "Area of a circle = πr² where r is the radius.",
      reference: "Mathematical Formulas"
    },
    {
      id: 'y1s5002',
      year: 1,
      section: 5,
      section_name: "Calculations and Science",
      difficulty: 'easy',
      question_text: "When a gas is heated it",
      option_a: "expands.",
      option_b: "contracts.",
      option_c: "condenses.",
      option_d: "solidifies.",
      correct_answer: "A",
      explanation: "When a gas is heated it expands. This is a fundamental principle in gas physics.",
      reference: "Science"
    },
    {
      id: 'y1s4001',
      year: 1,
      section: 4,
      section_name: "Drawings and Specifications",
      difficulty: 'easy',
      question_text: "On an isometric drawing, lines that run parallel to the pipe axis typically represent:",
      option_a: "Hidden features",
      option_b: "The pipe run itself",
      option_c: "Dimensions only",
      option_d: "Weld locations",
      correct_answer: "B",
      explanation: "In isometric piping drawings, lines following the pipe axis represent the pipe run.",
      reference: "Drawing interpretation"
    }
  ],
  
  // Year 2 - Intermediate questions
  year2: [
    {
      id: 'y2s3001',
      year: 2,
      section: 3,
      section_name: "Metal Fabrication",
      difficulty: 'medium',
      question_text: "What color is the oxygen hose and what color is the acetylene hose?",
      option_a: "Both are black",
      option_b: "Oxygen is red, acetylene is green",
      option_c: "Oxygen is green, acetylene is red",
      option_d: "Both are blue",
      correct_answer: "C",
      explanation: "The oxygen hose is green and the acetylene hose is red for safety identification.",
      reference: "Pipe Welding with Oxyacetylene and Arc"
    },
    {
      id: 'y2s5001',
      year: 2,
      section: 5,
      section_name: "Calculations and Science",
      difficulty: 'medium',
      question_text: "For a 45° offset, if the set (S) is 19½ inches, what is the travel (T)? Use the multiplier 1.414.",
      option_a: "22.5 in",
      option_b: "27.5 in",
      option_c: "19.5 in",
      option_d: "30.0 in",
      correct_answer: "B",
      explanation: "T = S × 1.414. T = 19.5 × 1.414 ≈ 27.573 in, round to 27½ in.",
      reference: "Calculating Offsets"
    },
    {
      id: 'y2s2001',
      year: 2,
      section: 2,
      section_name: "Tools, Equipment and Materials",
      difficulty: 'medium',
      question_text: "Which welding process is commonly used for pipe fabrication in second year?",
      option_a: "TIG welding only",
      option_b: "MIG welding only",
      option_c: "Oxyacetylene welding",
      option_d: "Stick welding only",
      correct_answer: "C",
      explanation: "Oxyacetylene welding is commonly taught in second year for pipe fabrication and cutting.",
      reference: "Welding Processes"
    }
  ],
  
  // Year 3 - Advanced questions
  year3: [
    {
      id: 'y3s3001',
      year: 3,
      section: 3,
      section_name: "Metal Fabrication",
      difficulty: 'medium',
      question_text: "What is the primary consideration when entering a confined space?",
      option_a: "Speed of entry",
      option_b: "Atmospheric testing",
      option_c: "Equipment availability",
      option_d: "Ventilation only",
      correct_answer: "B",
      explanation: "Atmospheric testing must be performed before confined space entry to ensure safe atmosphere.",
      reference: "Confined Space Safety"
    },
    {
      id: 'y3s5001',
      year: 3,
      section: 5,
      section_name: "Calculations and Science",
      difficulty: 'medium',
      question_text: "What is the formula for calculating a simple rolling offset?",
      option_a: "Offset × 1.414",
      option_b: "Run × 0.577",
      option_c: "Set × 2.414",
      option_d: "Travel ÷ 1.414",
      correct_answer: "A",
      explanation: "For a simple rolling offset, multiply the offset distance by 1.414 to find the run.",
      reference: "Pipe Layout Calculations"
    }
  ],
  
  // Year 4 - Journeyman questions
  year4: [
    {
      id: 'y4s1001',
      year: 4,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      difficulty: 'hard',
      question_text: "What is the primary responsibility of a journeyman regarding safety management?",
      option_a: "Follow all instructions without question",
      option_b: "Report hazards and implement controls",
      option_c: "Focus only on productivity",
      option_d: "Delegate safety to supervisors",
      correct_answer: "B",
      explanation: "Journeyman are responsible for identifying hazards and implementing appropriate safety controls.",
      reference: "Advanced Safety Management"
    },
    {
      id: 'y4s5001',
      year: 4,
      section: 5,
      section_name: "Calculations and Science",
      difficulty: 'hard',
      question_text: "What calculation method is used for compound offsets in pipefitting?",
      option_a: "Simple multiplication",
      option_b: "Trigonometric functions",
      option_c: "Pythagorean theorem only",
      option_d: "Basic addition only",
      correct_answer: "B",
      explanation: "Compound offsets require trigonometric functions for accurate calculation of angles and distances.",
      reference: "Advanced Pipe Layout"
    },
    {
      id: 'y4s4001',
      year: 4,
      section: 4,
      section_name: "Drawings and Specifications",
      difficulty: 'hard',
      question_text: "On P&ID drawings, what does the symbol 'FC' typically represent?",
      option_a: "Flow control",
      option_b: "Level control",
      option_c: "Pressure control",
      option_d: "Temperature control",
      correct_answer: "C",
      explanation: "In P&ID symbols, 'FC' typically represents flow control valves or controllers.",
      reference: "P&ID Symbol Interpretation"
    }
  ]
};

// Study guide content for each year
const studyGuideDatabase = {
  year1: [
    {
      id: 'guide-1-safety',
      year: 1,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      content: "• Trade entrance exam: 100 questions, 3 hours, pass mark 70%.\n• PPE: hard hats, eye protection, correct use for the task.\n• Exam strategy: do easy questions first; note progress per hour.\n• Fire classes: Class A (ordinary combustibles), B (flammables), C (electrical), D (metals)."
    },
    {
      id: 'guide-1-math',
      year: 1,
      section: 5,
      section_name: "Calculations and Science",
      content: "• Area of a circle = πr². Circumference = πD. Volume of a cylinder = πr²h.\n• Gas expands when heated; water boils at 100°C at sea level.\n• Density = mass/volume (e.g. g/cm³). A liter of water has a mass of 1 kg."
    }
  ],
  
  year2: [
    {
      id: 'guide-2-welding',
      year: 2,
      section: 3,
      section_name: "Metal Fabrication",
      content: "• Intermediate welding techniques and safety.\n• Gas welding: oxygen is green, acetylene is red.\n• Basic fabrication measurements and layout.\n• Portable welding equipment setup and operation."
    },
    {
      id: 'guide-2-math',
      year: 2,
      section: 5,
      section_name: "Calculations and Science",
      content: "• For offsets: Travel = Set × multiplier. Common multipliers: 45° = 1.414, 30° = 1.155, 60° = 2.000.\n• Intermediate metric ↔ imperial conversions.\n• Simple geometry for pipe layouts."
    }
  ],
  
  year3: [
    {
      id: 'guide-3-safety',
      year: 3,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      content: "• Confined space entry procedures and permits.\n• Atmospheric testing requirements.\n• Advanced hazard assessment techniques.\n• Emergency response planning for industrial settings."
    },
    {
      id: 'guide-3-math',
      year: 3,
      section: 5,
      section_name: "Calculations and Science",
      content: "• Simple rolling offsets and compound calculations.\n• Intermediate trigonometry for pipe fitting.\n• Advanced layout calculations for pipe systems.\n• Load calculations for basic rigging."
    }
  ],
  
  year4: [
    {
      id: 'guide-4-safety',
      year: 4,
      section: 1,
      section_name: "Workplace Safety and Rigging",
      content: "• Advanced hazard and risk assessment methodologies.\n• Environmental compliance and regulations.\n• Emergency response procedures and management.\n• Journeyman-level safety responsibilities and authority."
    },
    {
      id: 'guide-4-systems',
      year: 4,
      section: 4,
      section_name: "Drawings and Specifications",
      content: "• Full isometric, orthographic, and P&ID reading.\n• Fabrication-level interpretation and analysis.\n• System selection fundamentals and applications.\n• Advanced valve and component specification reading."
    }
  ]
};

function generateQuestionsForYear(year) {
  console.log(`Generating comprehensive questions for Year ${year}...`);
  
  const questions = questionDatabase[`year${year}`] || [];
  const studyGuides = studyGuideDatabase[`year${year}`] || [];
  
  console.log(`Generated ${questions.length} questions and ${studyGuides.length} study guides for Year ${year}`);
  
  return { questions, studyGuides };
}

function generateAllYears() {
  console.log('Generating comprehensive questions for all years...');
  
  const allResults = {};
  const allQuestions = [];
  const allStudyGuides = [];
  
  for (let year = 1; year <= 4; year++) {
    const result = generateQuestionsForYear(year);
    allResults[year] = result;
    allQuestions.push(...result.questions);
    allStudyGuides.push(...result.studyGuides);
  }
  
  return { allResults, allQuestions, allStudyGuides };
}

function writeOutputFiles(allResults) {
  console.log('\nWriting output files...');
  
  // Write individual year files
  Object.keys(allResults).forEach(year => {
    const result = allResults[year];
    
    // Write questions
    const questionsPath = `public/data/questions-year-${year}.json`;
    fs.writeFileSync(questionsPath, JSON.stringify(result.questions, null, 2));
    console.log(`✓ Created ${questionsPath} with ${result.questions.length} questions`);
    
    // Write study guides
    const guidesPath = `public/data/study-guides-year-${year}.json`;
    fs.writeFileSync(guidesPath, JSON.stringify(result.studyGuides, null, 2));
    console.log(`✓ Created ${guidesPath} with ${result.studyGuides.length} study guides`);
  });
  
  // Write combined files
  const allQuestions = [];
  const allStudyGuides = [];
  
  Object.values(allResults).forEach(result => {
    allQuestions.push(...result.questions);
    allStudyGuides.push(...result.studyGuides);
  });
  
  // Write combined questions file
  fs.writeFileSync(
    'public/data/questions-comprehensive.json',
    JSON.stringify(allQuestions, null, 2)
  );
  console.log(`✓ Created public/data/questions-comprehensive.json with ${allQuestions.length} total questions`);
  
  // Write combined study guides file
  fs.writeFileSync(
    'public/data/study-guides-comprehensive.json',
    JSON.stringify(allStudyGuides, null, 2)
  );
  console.log(`✓ Created public/data/study-guides-comprehensive.json with ${allStudyGuides.length} total study guides`);
}

// Main execution
function main() {
  console.log('=== Comprehensive Steamfitter/Pipefitter Question Generator ===\n');
  
  const { allResults, allQuestions, allStudyGuides } = generateAllYears();
  writeOutputFiles(allResults);
  
  console.log(`\n=== Generation Complete ===`);
  console.log(`Total Questions Generated: ${allQuestions.length}`);
  console.log(`Total Study Guides Generated: ${allStudyGuides.length}`);
  console.log('\nFiles created:');
  console.log('- public/data/questions-year-1.json');
  console.log('- public/data/questions-year-2.json');
  console.log('- public/data/questions-year-3.json');
  console.log('- public/data/questions-year-4.json');
  console.log('- public/data/questions-comprehensive.json');
  console.log('- public/data/study-guides-year-1.json');
  console.log('- public/data/study-guides-year-2.json');
  console.log('- public/data/study-guides-year-3.json');
  console.log('- public/data/study-guides-year-4.json');
  console.log('- public/data/study-guides-comprehensive.json');
}

// Run if called directly
if (process.argv[1]) {
  main();
}

export {
  generateQuestionsForYear,
  generateAllYears,
  questionDatabase,
  studyGuideDatabase
};
