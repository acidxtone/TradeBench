import React, { useState, useEffect } from 'react';
import { api } from '@/api/localClient';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Target, 
  Zap, 
  Calculator, 
  BookOpen, 
  AlertTriangle,
  Clock,
  Settings,
  ChevronRight,
  Sparkles,
  FileText
} from "lucide-react";
import { motion } from "framer-motion";
import StatsOverview from '@/components/dashboard/StatsOverview';
import SectionProgress from '@/components/dashboard/SectionProgress';
import QuizModeCard from '@/components/dashboard/QuizModeCard';
import YearIndicator from '@/components/YearIndicator';
import YearHeader from '@/components/YearHeader';
import { BannerAd } from '@/components/ads/AdSense';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const { data: questions = [] } = useQuery({
    queryKey: ['questions', user?.selected_year],
    queryFn: async () => {
      if (!user?.selected_year) return [];
      const results = await api.entities.Question.filter({ year: user.selected_year });
      return results;
    },
    enabled: !!user?.selected_year
  });

  const quizModes = [
    {
      mode: 'practice',
      title: 'Practice Mode',
      description: 'Answer questions with immediate feedback',
      icon: Target,
      color: 'bg-blue-500',
      badge: progress?.total_questions_answered || 0
    },
    {
      mode: 'timed',
      title: 'Timed Quiz',
      description: 'Simulate exam conditions',
      icon: Clock,
      color: 'bg-red-500',
      badge: progress?.quizzes_completed || 0
    },
    {
      mode: 'study',
      title: 'Study Mode',
      description: 'Review materials and learn',
      icon: BookOpen,
      color: 'bg-green-500',
      badge: null
    },
    {
      mode: 'weakness',
      title: 'Weak Areas',
      description: 'Focus on topics you struggle with',
      icon: AlertTriangle,
      color: 'bg-orange-500',
      badge: progress?.weak_questions?.length || 0
    }
  ];

  const readinessScore = Math.min(
    Math.round(
      ((progress?.total_correct || 0) / Math.max(progress?.total_questions_answered || 1, 1)) * 100
    ),
    100
  );

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
          className="space-y-8"
        >
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-800">
                  Welcome back, {user?.full_name || user?.email?.split('@')[0]}!
                </h1>
                <p className="text-slate-600 mt-1">
                  Ready to continue your Steamfitter/Pipefitter journey?
                </p>
              </div>
              <div className="flex items-center gap-3">
                <YearIndicator year={user.selected_year} />
                <Button variant="outline" size="sm" asChild>
                  <Link to={createPageUrl('Settings')}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <StatsOverview progress={progress} />
          </motion.div>

          {/* Study Materials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Study Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link to={createPageUrl('Study')}>
                    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">Study Guides</h3>
                          <p className="text-sm text-slate-500">Comprehensive learning materials</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <Link to={createPageUrl('Curriculum')}>
                    <div className="p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <GraduationCap className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-800">Curriculum</h3>
                          <p className="text-sm text-slate-500">View learning objectives</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="h-4 w-4" />
                  {questions.length} questions available
                </div>
              </CardContent>
            </Card>
          </motion.div>
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">Choose Quiz Mode</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizModes.map((mode, index) => (
                <Link 
                  key={mode.mode} 
                  to={createPageUrl('QuizSetup') + `?mode=${mode.mode}`}
                >
                  <QuizModeCard {...mode} />
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SectionProgress sectionStats={progress?.section_stats} />
              </div>
              
              {/* Exam Readiness */}
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold">Exam Readiness</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center py-6">
                    <div className="relative w-32 h-32">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="#f1f5f9"
                          strokeWidth="12"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke={readinessScore >= 70 ? "#10b981" : readinessScore >= 50 ? "#f59e0b" : "#ef4444"}
                          strokeWidth="12"
                          strokeLinecap="round"
                          strokeDasharray={`${(readinessScore / 100) * 352} 352`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-3xl font-bold text-slate-800">{readinessScore}%</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 mt-4 text-center">
                      {readinessScore >= 70 
                        ? "You're on track! Keep practicing."
                        : readinessScore >= 50
                        ? "Good progress. Focus on weak areas."
                        : "Practice more to improve readiness."}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      Based on accuracy and practice volume
                    </p>
                  </div>

                  <div className="border-t pt-4 mt-4">
                    <h4 className="text-sm font-medium text-slate-700 mb-3">Exam Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Questions</span>
                        <span className="font-medium">100</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Time Limit</span>
                        <span className="font-medium">3 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Pass Mark</span>
                        <span className="font-medium text-emerald-600">70%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </motion.div>
      </main>
      <BannerAd position="bottom" />
    </div>
  );
}

  const { data: progress } = useQuery({
    queryKey: ['userProgress'],
    queryFn: async () => {
      const results = await api.entities.UserProgress.filter({ created_by: user?.email });
      return results[0] || null;
    },
    enabled: !!user?.email
  });

  const { data: questions = [] } = useQuery({
    queryKey: ['questionCount', user?.selected_year],
    queryFn: () => api.entities.Question.filter({ year: user?.selected_year || 1 }),
    enabled: !!user?.selected_year
  });

  const quizModes = [
    {
      mode: 'full_exam',
      title: 'Full Practice Exam',
      description: '100 questions • 3 hours • Simulates the real exam',
      icon: GraduationCap,
      color: 'slate',
      badge: '100 Q'
    },
    {
      mode: 'section_focus',
      title: 'Section Focus',
      description: 'Practice specific sections to strengthen weak areas',
      icon: Target,
      color: 'blue',
      badge: 'Custom'
    },
    {
      mode: 'quick_quiz',
      title: 'Quick Quiz',
      description: '10-30 questions for daily practice sessions',
      icon: Zap,
      color: 'purple',
      badge: '10-30 Q'
    },
    {
      mode: 'calculations',
      title: 'Calculations Intensive',
      description: 'Focus on math and science calculations',
      icon: Calculator,
      color: 'emerald',
      badge: 'Section 5'
    },
    {
      mode: 'weak_areas',
      title: 'Weak Areas Practice',
      description: 'Review questions you previously answered incorrectly',
      icon: AlertTriangle,
      color: 'amber',
      badge: progress?.weak_questions?.length || 0
    },
    {
      mode: 'bookmarked',
      title: 'Bookmarked Questions',
      description: 'Practice questions you\'ve saved for review',
      icon: BookOpen,
      color: 'rose',
      badge: progress?.bookmarked_questions?.length || 0
    }
  ];

  const readinessScore = progress?.total_questions_answered 
    ? Math.min(100, Math.round((progress.total_correct / progress.total_questions_answered) * 100 * 
        (progress.total_questions_answered >= 500 ? 1 : progress.total_questions_answered / 500)))
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">TradeBench</h1>
                <p className="text-xs text-slate-500">Steamfitter/Pipefitter Exam Prep</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user?.selected_year && <YearIndicator year={user.selected_year} />}
              <Link to={createPageUrl('Settings')}>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-slate-800 to-slate-900 text-white overflow-hidden">
            <CardContent className="p-8 relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-amber-400" />
                  <span className="text-amber-400 font-medium text-sm">Ready to study?</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">
                  Welcome{user?.full_name ? `, ${user.full_name.split(' ')[0]}` : ''}!
                </h2>
                <p className="text-slate-300 mb-6 max-w-xl">
                  Prepare for your Alberta Steamfitter-Pipefitter theory exams with adaptive practice tests.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to={createPageUrl('Quiz') + '?mode=quick_quiz&questions=20'}>
                    <Button className="bg-white text-slate-900 hover:bg-slate-100">
                      Start 20 Question Quiz
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to={createPageUrl('Study')}>
                    <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Study Materials
                    </Button>
                  </Link>
                  <Link to={createPageUrl('Curriculum')}>
                    <Button variant="outline" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                      <FileText className="mr-2 h-4 w-4" />
                      Curriculum Guide
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Clock className="h-4 w-4" />
                    {questions.length} questions available
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-slate-800 mb-4">Choose Quiz Mode</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizModes.map((mode, index) => (
              <Link 
                key={mode.mode} 
                to={createPageUrl('QuizSetup') + `?mode=${mode.mode}`}
              >
                <QuizModeCard {...mode} />
              </Link>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SectionProgress sectionStats={progress?.section_stats} />
            </div>
            
            {/* Exam Readiness */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">Exam Readiness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center py-6">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke="#f1f5f9"
                        strokeWidth="12"
                      />
                      <circle
                        cx="64"
                        cy="64"
                        r="56"
                        fill="none"
                        stroke={readinessScore >= 70 ? "#10b981" : readinessScore >= 50 ? "#f59e0b" : "#ef4444"}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${(readinessScore / 100) * 352} 352`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">{readinessScore}%</span>
                    </div>
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Exam Readiness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center py-6">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="#f1f5f9"
                      strokeWidth="12"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke={readinessScore >= 70 ? "#10b981" : readinessScore >= 50 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${(readinessScore / 100) * 352} 352`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-slate-800">{readinessScore}%</span>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-4 text-center">
                  {readinessScore >= 70 
                    ? "You're on track! Keep practicing."
                    : readinessScore >= 50
                    ? "Good progress. Focus on weak areas."
                    : "Practice more to improve readiness."}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  Based on accuracy and practice volume
                </p>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium text-slate-700 mb-3">Exam Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Questions</span>
                    <span className="font-medium">100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Time Limit</span>
                    <span className="font-medium">3 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pass Mark</span>
                    <span className="font-medium text-emerald-600">70%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}