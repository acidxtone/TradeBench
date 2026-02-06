/**
 * Question Generator for Steamfitter/Pipefitter Exam Prep
 * Uses curriculum guide and knowledge base to generate AIT-style questions
 */

import fs from 'fs';
import path from 'path';

// Question generation templates
const questionTemplates = {
  safety: [
    {
      question: "What is the primary responsibility of workers regarding workplace safety?",
      options: {
        A: "Report all hazards immediately",
        B: "Follow employer instructions only", 
        C: "Focus on productivity over safety",
        D: "Wait for supervisor to identify hazards"
      },
      correct: "A",
      explanation: "Workers have a legal and ethical responsibility to report identified hazards immediately to ensure workplace safety.",
      reference: "Alberta OHS Act"
    },
    {
      question: "Which fire class involves ordinary combustibles like wood and paper?",
      options: {
        A: "Class A",
        B: "Class B", 
        C: "Class C",
        D: "Class D"
      },
      correct: "A",
      explanation: "Class A fires involve ordinary combustibles such as wood, paper, cloth, and most plastics.",
      reference: "Fire Safety Basics"
    }
  ],
  
  tools: [
    {
      question: "What measuring tool is essential for ensuring square cuts on pipe?",
      options: {
        A: "Tape measure only",
        B: "Pipe cutter",
        C: "Square and level",
        D: "Hammer"
      },
      correct: "C",
      explanation: "A square and level are essential tools for ensuring pipe cuts are perfectly square, which is critical for proper fitting.",
      reference: "Pipe Cutting Tools"
    }
  ],
  
  math: [
    {
      question: "What is the area of a circle with a radius of 4 inches?",
      options: {
        A: "12.57 square inches",
        B: "25.13 square inches",
        C: "50.27 square inches", 
        D: "100.53 square inches"
      },
      correct: "C",
      explanation: "Area = πr² = π × 4² = π × 16 = 50.27 square inches.",
      reference: "Mathematical Formulas"
    }
  ],
  
  drawings: [
    {
      question: "On an isometric drawing, lines that run parallel to the pipe axis typically represent:",
      options: {
        A: "Hidden features",
        B: "The pipe run itself",
        C: "Dimensions only",
        D: "Weld locations"
      },
      correct: "B", 
      explanation: "In isometric piping drawings, lines following the pipe axis represent the actual pipe run through the system.",
      reference: "Drawing Interpretation"
    }
  ]
};

// Year-specific difficulty modifiers
const yearModifiers = {
  1: {
    difficulty: 'easy',
    complexity: 'basic',
    excludeAdvanced: true
  },
  2: {
    difficulty: 'medium',
    complexity: 'intermediate', 
    excludeAdvanced: true
  },
  3: {
    difficulty: 'medium',
    complexity: 'advanced',
    excludeAdvanced: false
  },
  4: {
    difficulty: 'hard',
    complexity: 'journeyman',
    excludeAdvanced: false
  }
};

// Section mappings for questions
const sections = {
  1: "Workplace Safety and Rigging",
  2: "Tools, Equipment and Materials", 
  3: "Metal Fabrication",
  4: "Drawings and Specifications",
  5: "Calculations and Science"
};

function generateQuestionId(year, section, index) {
  return `y${year}s${section}q${String(index + 1).padStart(3, '0')}`;
}

function generateQuestionsForYear(year) {
  const modifier = yearModifiers[year];
  const questions = [];
  
  // Generate questions for each section based on year scope
  Object.keys(questionTemplates).forEach((category, categoryIndex) => {
    const section = categoryIndex + 1;
    const categoryQuestions = questionTemplates[category];
    
    categoryQuestions.forEach((template, templateIndex) => {
      const question = {
        id: generateQuestionId(year, section, templateIndex),
        year: year,
        section: section,
        section_name: sections[section] || `Section ${section}`,
        difficulty: modifier.difficulty,
        question_text: template.question,
        option_a: template.options.A,
        option_b: template.options.B,
        option_c: template.options.C,
        option_d: template.options.D,
        correct_answer: template.correct,
        explanation: template.explanation,
        reference: template.reference
      };
      
      questions.push(question);
    });
  });
  
  return questions;
}

function generateStudyGuidesForYear(year) {
  const guides = [];
  
  // Sample study guide content based on year
  const yearContent = {
    1: {
      sections: [
        {
          year: 1,
          section: 1,
          section_name: "Workplace Safety and Rigging",
          content: "• Trade entrance exam: 100 questions, 3 hours, pass mark 70%.\n• PPE: hard hats, eye protection, correct use for the task.\n• Exam strategy: do easy questions first; note progress per hour."
        },
        {
          year: 1,
          section: 5,
          section_name: "Calculations and Science", 
          content: "• Area of a circle = πr². Circumference = πD. Volume of a cylinder = πr²h.\n• Gas expands when heated; water boils at 100°C at sea level."
        }
      ]
    },
    2: {
      sections: [
        {
          year: 2,
          section: 3,
          section_name: "Metal Fabrication",
          content: "• Intermediate welding techniques and safety.\n• Gas welding: oxygen is green, acetylene is red.\n• Basic fabrication measurements and layout."
        }
      ]
    }
  };
  
  const content = yearContent[year];
  if (content) {
    content.sections.forEach((guide, index) => {
      guides.push({
        id: `guide-${year}-${index + 1}`,
        ...guide
      });
    });
  }
  
  return guides;
}

// Main generation function
function generateAllContent() {
  const allQuestions = [];
  const allStudyGuides = [];
  
  // Generate for years 1-4
  for (let year = 1; year <= 4; year++) {
    const questions = generateQuestionsForYear(year);
    const guides = generateStudyGuidesForYear(year);
    
    allQuestions.push(...questions);
    allStudyGuides.push(...guides);
  }
  
  return {
    questions: allQuestions,
    studyGuides: allStudyGuides
  };
}

// Export functions for use
export {
  generateQuestionsForYear,
  generateStudyGuidesForYear,
  generateAllContent
};

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const { questions, studyGuides } = generateAllContent();
  
  // Write questions file
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'questions-generated.json'),
    JSON.stringify(questions, null, 2)
  );
  
  // Write study guides file  
  fs.writeFileSync(
    path.join(process.cwd(), 'public', 'data', 'study-guides-generated.json'),
    JSON.stringify(studyGuides, null, 2)
  );
  
  console.log(`Generated ${questions.length} questions and ${studyGuides.length} study guides`);
}
