import React from 'react';
import { Home, Settings, DollarSign } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function Navigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bg-[#FF3366] border-t-4 border-black fixed bottom-0 w-full">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around py-4">
          <button
            onClick={() => navigate('/')}
            className={`neo-button ${
              location.pathname === '/' ? 'bg-[#FFDE00]' : 'bg-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Home className="h-6 w-6" />
              <span className="text-xs font-bold">Home</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/assets')}
            className={`neo-button ${
              location.pathname === '/assets' ? 'bg-[#FFDE00]' : 'bg-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <DollarSign className="h-6 w-6" />
              <span className="text-xs font-bold">Assets</span>
            </div>
          </button>
          <button
            onClick={() => navigate('/settings')}
            className={`neo-button ${
              location.pathname === '/settings' ? 'bg-[#FFDE00]' : 'bg-white'
            }`}
          >
            <div className="flex flex-col items-center space-y-1">
              <Settings className="h-6 w-6" />
              <span className="text-xs font-bold">Settings</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}