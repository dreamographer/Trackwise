import React from 'react';
import { Home, Settings, DollarSign } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around py-4">
          <button
            onClick={() => navigate('/')}
            className={`flex flex-col items-center space-y-1 ${
              location.pathname === '/' ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => navigate('/assets')}
            className={`flex flex-col items-center space-y-1 ${
              location.pathname === '/assets' ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <DollarSign className="h-6 w-6" />
            <span className="text-xs">Assets</span>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className={`flex flex-col items-center space-y-1 ${
              location.pathname === '/settings' ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            <Settings className="h-6 w-6" />
            <span className="text-xs">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}