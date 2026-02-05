# Steamfitter/Pipefitter Question Generator

This system generates comprehensive AIT-style multiple-choice questions and study guides for all four years of the Steamfitter/Pipefitter apprenticeship program.

## Files Created

### Question Generation Scripts
- `scripts/comprehensive-generator.js` - Main question generator using curriculum and knowledge base
- `scripts/content-parser.js` - Parses and extracts year-specific content from knowledge base
- `scripts/advanced-question-generator.js` - Advanced generator with pattern matching

### Generated Output Files

#### Questions (JSON format)
- `public/data/questions-year-1.json` - Year 1 questions (7 questions)
- `public/data/questions-year-2.json` - Year 2 questions (3 questions)  
- `public/data/questions-year-3.json` - Year 3 questions (2 questions)
- `public/data/questions-year-4.json` - Year 4 questions (3 questions)
- `public/data/questions-comprehensive.json` - All years combined (15 questions)

#### Study Guides (JSON format)
- `public/data/study-guides-year-1.json` - Year 1 study guides (2 guides)
- `public/data/study-guides-year-2.json` - Year 2 study guides (2 guides)
- `public/data/study-guides-year-3.json` - Year 3 study guides (2 guides)
- `public/data/study-guides-year-4.json` - Year 4 study guides (2 guides)
- `public/data/study-guides-comprehensive.json` - All years combined (8 guides)

## Question Structure

Each question follows this format:
```json
{
  "id": "y1s1001",
  "year": 1,
  "section": 1,
  "section_name": "Workplace Safety and Rigging",
  "difficulty": "easy",
  "question_text": "What is the primary purpose of a hard hat on a worksite?",
  "option_a": "To identify the worker's role",
  "option_b": "To protect the head from impact and falling objects", 
  "option_c": "To hold radios and lights",
  "option_d": "To comply with fashion standards",
  "correct_answer": "B",
  "explanation": "Hard hats are PPE designed to protect the head from impact, falling objects, and electrical shock.",
  "reference": "PPE and worksite safety"
}
```

## Study Guide Structure

Each study guide follows this format:
```json
{
  "id": "guide-1-safety",
  "year": 1,
  "section": 1,
  "section_name": "Workplace Safety and Rigging",
  "content": "• Trade entrance exam: 100 questions, 3 hours, pass mark 70%.\n• PPE: hard hats, eye protection, correct use for the task."
}
```

## Year-Specific Content

### Year 1 - Basic Apprenticeship
**Focus:** Safety fundamentals, basic tools, introductory math, blueprint reading
**Difficulty:** Easy
**Sections:**
- Workplace Safety and Rigging (PPE, exam format, fire safety)
- Tools, Equipment and Materials (basic hand tools, pipe identification)
- Calculations and Science (area formulas, gas properties, basic conversions)
- Drawings and Specifications (blueprint fundamentals, basic symbols)

### Year 2 - Intermediate Apprenticeship  
**Focus:** Welding, intermediate rigging, simple offsets, material applications
**Difficulty:** Medium
**Sections:**
- Metal Fabrication (gas welding, oxygen/acetylene colors)
- Tools, Equipment and Materials (portable equipment, tool care)
- Rigging, Lifting & Hoisting (intermediate components, load handling)
- Calculations and Science (offset calculations, conversions)

### Year 3 - Advanced Apprenticeship
**Focus:** Confined spaces, load calculations, advanced fabrication, complex drawings
**Difficulty:** Medium
**Sections:**
- Workplace Safety and Rigging (confined space entry, atmospheric testing)
- Tools, Equipment and Materials (advanced welding, maintenance)
- Rigging, Lifting & Hoisting (load calculations, signal coordination)
- Calculations and Science (compound offsets, trigonometry)

### Year 4 - Journeyman Level
**Focus:** System design, advanced calculations, compliance, leadership
**Difficulty:** Hard
**Sections:**
- Workplace Safety and Rigging (risk assessment, environmental compliance)
- Tools, Equipment and Materials (specialty tools, instrumentation)
- Rigging, Lifting & Hoisting (advanced rigging, lift planning)
- Calculations and Science (compound offsets, advanced trigonometry)
- Drawings and Specifications (P&ID reading, fabrication details)

## Usage

### Generate All Years
```bash
npm run generate-questions
```

### Generate Specific Year
```bash
npm run generate-year 1  # Generate Year 1 questions only
npm run generate-year 2  # Generate Year 2 questions only
npm run generate-year 3  # Generate Year 3 questions only
npm run generate-year 4  # Generate Year 4 questions only
```

### Custom Generation
```bash
node scripts/comprehensive-generator.js
```

## Integration with Supabase

The generated question files are ready for migration to Supabase:

1. **Set up Supabase project** following `README-SUPABASE.md`
2. **Run database schema** from `supabase/schema.sql`
3. **Migrate questions** using the migration script:
   ```bash
   npm run migrate
   ```

The migration script will:
- Create questions table with all generated questions
- Create study_guides table with all study guides
- Set up proper relationships and indexes
- Enable Row Level Security

## Question Sources

Questions are generated based on:
- **Alberta AIT Curriculum Outcomes** for each year
- **Trade Entrance Exam Study Guide** for Year 1
- **Steamfitter/Pipefitter Knowledge Base** for technical content
- **Official Handbooks** and approved textbooks
- **Industry standards** (CSA, ASME)

## Quality Assurance

- All questions follow AIT multiple-choice format
- Four answer options per question
- Clear explanations for correct and incorrect answers
- Alberta trade terminology used throughout
- Year-appropriate difficulty progression
- References to official study materials

## Next Steps

1. **Review generated questions** for accuracy and completeness
2. **Test with sample users** in the application
3. **Refine question difficulty** based on user feedback
4. **Add more questions** to reach comprehensive coverage (target: 100+ questions per year)
5. **Implement adaptive testing** based on user performance
