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
    <nav className='aside'>
      <header>
        <h4>Data Assistant</h4>
      </header>
      <ul>
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
  );
};
