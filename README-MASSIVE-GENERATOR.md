# Massive Question Generator - 480 Questions (120 per Year)

This system generates comprehensive AIT-style questions and integrated study materials for all four years of the Steamfitter/Pipefitter apprenticeship program.

## 🎯 **Generated Content**

### **Questions Generated:**
- **Year 1**: 120 questions (30 per section: Safety, Tools, Math, Drawings)
- **Year 2**: 120 questions (30 per section: Safety, Tools, Math, Drawings)  
- **Year 3**: 120 questions (30 per section: Safety, Tools, Math, Drawings)
- **Year 4**: 120 questions (30 per section: Safety, Tools, Math, Drawings)
- **Total**: 480 questions across all years

### **Study Materials Generated:**
- **Year 1**: 4 integrated study guides (one per section)
- **Year 2**: 4 integrated study guides (one per section)
- **Year 3**: 4 integrated study guides (one per section)
- **Year 4**: 4 integrated study guides (one per section)
- **Total**: 16 comprehensive study guides

## 📁 **Files Created**

### **Question Files:**
- `public/data/questions-massive-year-1.json` - 120 Year 1 questions
- `public/data/questions-massive-year-2.json` - 120 Year 2 questions
- `public/data/questions-massive-year-3.json` - 120 Year 3 questions
- `public/data/questions-massive-year-4.json` - 120 Year 4 questions
- `public/data/questions-massive-comprehensive.json` - All 480 questions combined

### **Study Guide Files:**
- `public/data/study-guides-massive-year-1.json` - Year 1 integrated study materials
- `public/data/study-guides-massive-year-2.json` - Year 2 integrated study materials
- `public/data/study-guides-massive-year-3.json` - Year 3 integrated study materials
- `public/data/study-guides-massive-year-4.json` - Year 4 integrated study materials
- `public/data/study-guides-massive-comprehensive.json` - All study guides combined

## 🎓 **Study Guide Integration**

**Key Feature**: Each study guide contains the actual questions and answers for that section, creating a complete learning resource:

```json
{
  "id": "guide-1-section-1",
  "year": 1,
  "section": 1,
  "section_name": "Workplace Safety and Rigging",
  "content": "## Workplace Safety and Rigging\n\n**Key Concepts and Practice Questions:**\n\n### Question 1\n**Question:** What is primary purpose of a hard hat on a worksite?\n**Options:**\n- A) To identify worker's role\n- B) To protect the head from impact and falling objects\n- C) To hold radios and lights\n- D) To comply with fashion standards\n**Correct Answer:** B\n**Explanation:** Hard hats are PPE designed to protect the head from impact, falling objects, and electrical shock.\n**Reference:** PPE and worksite safety"
}
```

## 📚 **Year-Specific Content**

### **Year 1 - Basic Apprenticeship**
**Sections:**
1. **Workplace Safety and Rigging** (30 questions)
2. **Tools, Equipment and Materials** (30 questions)
3. **Calculations and Science** (30 questions)
4. **Drawings and Specifications** (30 questions)

**Topics Covered:**
- Trade entrance exam preparation (70% pass mark, 3 hours, 100 questions)
- Basic PPE and safety procedures
- Fundamental hand tools and equipment
- Basic mathematics (area, circumference, conversions)
- Blueprint reading fundamentals

### **Year 2 - Intermediate Apprenticeship**
**Sections:** Same structure with intermediate-level content
**Topics Covered:**
- Intermediate safety procedures and confined space awareness
- Gas welding (oxygen green, acetylene red)
- Portable welding equipment
- Intermediate calculations (offsets, metric conversions)
- Advanced tool operations

### **Year 3 - Advanced Apprenticeship**
**Sections:** Same structure with advanced-level content
**Topics Covered:**
- Advanced hazard assessment and confined space entry
- Intermediate to advanced welding and cutting
- Load calculations for rigging
- Simple rolling offsets
- Advanced pipe system components

### **Year 4 - Journeyman Level**
**Sections:** Same structure with journeyman-level content
**Topics Covered:**
- Advanced safety management and environmental compliance
- Specialty tools and instrumentation
- Advanced rigging and lift planning
- P&ID reading and interpretation
- Complex system calculations

## 🚀 **Usage**

### **Generate All Years (480 questions):**
```bash
npm run generate-massive
```

### **Individual Year Generation:**
```bash
node scripts/massive-generator.js
```

## 🔄 **App Integration**

When users switch years in the application, they will have access to:

1. **120 relevant questions** for their current year
2. **4 comprehensive study guides** containing all questions and answers
3. **Year-appropriate difficulty** and terminology
4. **Complete learning resources** for exam preparation

### **Study Guide Features:**
- **Questions grouped by section** for organized learning
- **Complete answer explanations** for each question
- **Reference materials** cited for further study
- **Progressive difficulty** within each year

## 📊 **Question Distribution**

| Year | Safety | Tools | Math | Drawings | Total |
|-------|---------|--------|-------|-----------|--------|
| 1     | 30      | 30     | 30    | 30        | 120    |
| 2     | 30      | 30     | 30    | 30        | 120    |
| 3     | 30      | 30     | 30    | 30        | 120    |
| 4     | 30      | 30     | 30    | 30        | 120    |
| **Total** | **120** | **120** | **120** | **120** | **480** |

## 🎯 **Ready for Supabase Migration**

The massive question files are ready for migration to Supabase:

1. **Set up Supabase project** following `README-SUPABASE.md`
2. **Run database schema** from `supabase/schema.sql`
3. **Migrate massive questions** using the migration script:
   ```bash
   npm run migrate
   ```

The migration will populate the Supabase database with 480 questions and 16 study guides, providing comprehensive coverage for all four years of the Steamfitter/Pipefitter apprenticeship program.

## ✅ **Quality Assurance**

- All questions follow AIT multiple-choice format
- Four answer options per question
- Clear explanations for correct and incorrect answers
- Alberta trade terminology used throughout
- Year-appropriate difficulty progression
- References to official study materials
- Integrated study materials for complete learning experience

## 📈 **Scalability**

The system is designed to scale:
- **Template-based generation** for consistent quality
- **Modular structure** for easy expansion
- **Year-specific content** for targeted learning
- **Integrated study guides** for comprehensive preparation

This massive question database provides a solid foundation for the Steamfitter/Pipefitter exam preparation application, with room for future expansion to hundreds more questions per year if needed.
