import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  BookOpen, 
  Search,
  Filter,
  FileText
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StudyQuestionCard from '@/components/study/StudyQuestionCard';
import YearIndicator from '@/components/YearIndicator';

export default function Study() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectionFilter, setSectionFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: allQuestions = [], isLoading } = useQuery({
    queryKey: ['questions', user?.selected_year],
    queryFn: () => base44.entities.Question.filter({ year: user?.selected_year || 1 }),
    enabled: !!user
  });

  const sections = [
    { id: 1, name: "Workplace Safety and Rigging" },
    { id: 2, name: "Tools, Equipment and Materials" },
    { id: 3, name: "Metal Fabrication" },
    { id: 4, name: "Drawings and Specifications" },
    { id: 5, name: "Calculations and Science" }
  ];

  const filteredQuestions = allQuestions.filter(q => {
    const matchesSearch = searchTerm === '' || 
      q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.explanation?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSection = sectionFilter === 'all' || 
      q.section === parseInt(sectionFilter);
    
    const matchesDifficulty = difficultyFilter === 'all' || 
      q.difficulty === difficultyFilter;

    return matchesSearch && matchesSection && matchesDifficulty;
  });

  const sectionCounts = sections.map(section => ({
    ...section,
    count: allQuestions.filter(q => q.section === section.id).length
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading study materials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Dashboard')} className="inline-flex items-center text-slate-600 hover:text-slate-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Link>
            <div className="flex items-center gap-4">
              {user?.selected_year && <YearIndicator year={user.selected_year} />}
              <Link to={createPageUrl('Curriculum')}>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  View Curriculum
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-slate-600" />
                <span className="text-sm font-medium text-slate-600">
                  {filteredQuestions.length} Questions
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Study Materials</h1>
          <p className="text-slate-600">
            Review all questions and answers organized by section. Perfect for studying before practice exams.
          </p>
        </div>

        {/* Section Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {sectionCounts.map(section => (
            <button
              key={section.id}
              onClick={() => setSectionFilter(sectionFilter === section.id.toString() ? 'all' : section.id.toString())}
              className={`p-3 rounded-lg border-2 transition-all text-left ${
                sectionFilter === section.id.toString()
                  ? 'border-slate-800 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-slate-500">Section {section.id}</span>
                <Badge variant="outline" className="text-xs">{section.count}</Badge>
              </div>
              <p className="text-xs text-slate-700 font-medium line-clamp-2">{section.name}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <Card className="border-0 shadow-sm mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search questions or explanations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={sectionFilter} onValueChange={setSectionFilter}>
                <SelectTrigger className="w-full md:w-64">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={section.id.toString()}>
                      Section {section.id}: {section.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Questions List */}
        {filteredQuestions.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <BookOpen className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-700 mb-2">No questions found</h3>
              <p className="text-slate-500">Try adjusting your filters or search term</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredQuestions.map((question, index) => (
              <StudyQuestionCard 
                key={question.id} 
                question={question} 
                number={index + 1}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}