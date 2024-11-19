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
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center space-x-2">
              <HandCoins className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">
                Track Wise
              </h1>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20">
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>

        <Navigation />
      </div>
    </BrowserRouter>
  );
}

export default App;