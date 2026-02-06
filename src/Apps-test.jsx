import React from 'react';

function App() {
  console.log('Simple App component rendering...');
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">App is Working!</h1>
        <p className="text-slate-600">The basic React app is loading successfully.</p>
      </div>
    </div>
  );
}

export default App;
