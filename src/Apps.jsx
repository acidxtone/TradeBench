import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import NavigationTracker from '@/lib/NavigationTracker'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { supabase } from '@/lib/supabase';
import React from 'react';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const DebugInfo = () => {
  const [envStatus, setEnvStatus] = React.useState({});
  const [dbStatus, setDbStatus] = React.useState({});

  React.useEffect(() => {
    // Check environment variables
    const envCheck = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'SET' : 'NOT SET',
      supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'SET' : 'NOT SET',
    };
    setEnvStatus(envCheck);

    // Check database connection
    const checkDatabase = async () => {
      try {
        const { data, error } = await supabase.from('questions').select('count');
        const { data: guideData, error: guideError } = await supabase.from('study_guides').select('count');
        
        setDbStatus({
          questions: error ? 'ERROR' : `${data?.length || 0} questions`,
          studyGuides: guideError ? 'ERROR' : `${guideData?.length || 0} study guides`,
          connection: error || guideError ? 'FAILED' : 'SUCCESS'
        });
      } catch (err) {
        setDbStatus({
          connection: 'FAILED',
          error: err.message
        });
      }
    };

    checkDatabase();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 text-white p-3 rounded-lg shadow-lg text-xs max-w-xs">
      <div className="font-bold mb-2">System Status</div>
      <div className="space-y-1">
        <div>Supabase URL: {envStatus.supabaseUrl}</div>
        <div>Supabase Key: {envStatus.supabaseKey}</div>
        <div>Google OAuth: {envStatus.googleClientId}</div>
        <div className="border-t border-slate-700 pt-1 mt-1">
          <div>Questions: {dbStatus.questions}</div>
          <div>Study Guides: {dbStatus.studyGuides}</div>
          <div>Connection: {dbStatus.connection}</div>
        </div>
      </div>
    </div>
  );
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />
      {Object.entries(Pages).map(([path, Page]) => (
        <Route
          key={path}
          path={`/${path}`}
          element={
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          }
        />
      ))}
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <NavigationTracker />
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
