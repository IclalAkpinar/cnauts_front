import React from 'react';
import { Outlet } from 'react-router-dom';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white font-inter">
      <Outlet />
    </div>
  );
};