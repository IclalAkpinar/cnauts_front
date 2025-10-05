import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderProps } from '../types';

export const Header: React.FC<HeaderProps> = ({ name, day, showBack }) => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-gray-800 p-4 shadow-xl border-b-2 border-green-500 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
          {showBack && (
              <button 
                  onClick={() => navigate('/')} 
                  className="text-green-400 hover:text-green-200 mr-4 transition duration-200 p-2 rounded-full hover:bg-gray-700"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                  </svg>
              </button>
          )}
          <h1 className="text-3xl font-bold text-green-400">
              C-NAUTS <span className="text-xl font-light text-gray-400">| Orbital Health Platform</span>
          </h1>
      </div>
      <div className="text-right text-gray-300">
        <p className="text-lg font-medium">{name}</p>
        <p className="text-sm text-gray-400">Mission Day: {day}</p>
      </div>
    </header>
  );
};