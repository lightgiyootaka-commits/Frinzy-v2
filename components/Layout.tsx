import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg dark:bg-dark-bg text-gray-800 dark:text-gray-200">
      <Header />
      <main className="flex-grow flex flex-col container mx-auto p-4 sm:p-6 pb-20 md:pb-6 pt-20 md:pt-6">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;