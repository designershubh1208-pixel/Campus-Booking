import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-lightBg dark:bg-darkBg py-8 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} CampusBook. All rights reserved.
        </div>
        <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};
