import React from 'react';
// Import routing hooks and components
import { Link, useLocation } from 'react-router-dom';

// 1. Use Link from react-router-dom instead of a generic <a> tag
const NavLink: React.FC<{
  to: string;
  children: React.ReactNode;
  isActive: boolean;
}> = ({ to, children, isActive }) => (
  <Link
    to={to}
    className={`p-2 rounded-lg text-lg transition-colors cursor-pointer block 
      ${
        isActive
          ? // Active link: Blue text with light blue background (e.g., blue-400/10)
            'text-blue-400 font-semibold bg-blue-400/10'
          : // Inactive link: Gray text that is visible on the dark background
            'text-gray-400 hover:text-white'
      }`}
  >
    {children}
  </Link>
);

export const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isDataGenerationActive = currentPath === '/generate';
  const isTalkToDataActive = currentPath === '/chat';

  return (
    // Sidebar Container: Dark background (gray-900)
    <div className='bg-gray-900 p-6 flex flex-col gap-8 h-full border-r border-gray-700'>
      {/* Header text should be white on the dark background */}
      <header>
        <h1 className='text-2xl font-bold text-white'>Data Assistant</h1>
      </header>

      <nav aria-label='Main Features'>
        <ul className='flex flex-col gap-2'>
          <li>
            <NavLink to='/generate' isActive={isDataGenerationActive}>
              Data Generation
            </NavLink>
          </li>
          <li>
            <NavLink to='/chat' isActive={isTalkToDataActive}>
              Talk to your data
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};
