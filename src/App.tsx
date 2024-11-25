import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HandCoins } from 'lucide-react';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';

// Lazy load routes
const Home = React.lazy(() => import('./pages/Home'));
const Assets = React.lazy(() => import('./pages/Assets'));
const Settings = React.lazy(() => import('./pages/Settings'));

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#FFDE00] flex flex-col">
        <header className="bg-[#FF3366] border-b-4 border-black p-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-4 rounded-lg border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <HandCoins className="h-8 w-8 text-black" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-wide"
                  style={{ fontFamily: "'Poppins', sans-serif" }}>
                Track Wise
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
          <div className="neo-card">
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </div>
        </main>

        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;