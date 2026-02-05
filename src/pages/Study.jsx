import React, { useState, useEffect } from 'react';
import { api } from '@/api/localClient';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Bookmark, 
  ArrowLeft,
  Filter,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import YearIndicator from '@/components/YearIndicator';
import YearHeader from '@/components/YearHeader';
import { BannerAd, InContentAd } from '@/components/ads/AdSense';

export default function Study() {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('all');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  useEffect(() => {
    api.auth.me().then(user => {
      setUser(user);
      if (!user.selected_year) {
        navigate(createPageUrl('YearSelection'));
      }
    }).catch(() => {});
  }, [navigate]);

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const results = await api.entities.UserProgress.filter({ created_by: user?.email });
      return results[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: studyGuides = [] } = useQuery({
    queryKey: ['studyGuides', user?.selected_year],
    queryFn: async () => {
      if (!user?.selected_year) return [];
      const results = await api.entities.StudyGuide.filter({ year: user.selected_year });
      return results;
    },
    enabled: !!user?.selected_year
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (questionId) => {
      if (!progress?.id) return;
      
      const currentBookmarks = progress?.bookmarked_questions || [];
      const updatedBookmarks = currentBookmarks.includes(questionId)
        ? currentBookmarks.filter(id => id !== questionId)
        : [...currentBookmarks, questionId];
      
      await api.entities.UserProgress.update(progress.id, {
        bookmarked_questions: updatedBookmarks
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['userProgress']);
    }
  });

  const filteredGuides = studyGuides.filter(guide => 
    selectedSection === 'all' || guide.section_name.toLowerCase().includes(selectedSection.toLowerCase())
  );

  const sections = ['all', ...new Set(studyGuides.map(g => g.section_name))];

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <YearHeader />
      <BannerAd position="top" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Study Materials</h1>
              <p className="text-slate-600 mt-1">
                Comprehensive guides for Year {user.selected_year}
              </p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={createPageUrl('Dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </div>

          {/* Filters */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search study guides..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {sections.map(section => (
                    <Button
                      key={section}
                      variant={selectedSection === section ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSection(section)}
                      className="capitalize"
                    >
                      {section}
                    </Button>
                  ))}
                </div>
              </div>
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