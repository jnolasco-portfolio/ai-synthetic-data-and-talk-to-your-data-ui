import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

// 1. Define the type for the props: 'children' must be a React element
interface AppLayoutProps {
  children: ReactNode;
}

// AppLayout.tsx (Updated return)
export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    // Outer container: Ensures full screen height and sets the primary dark shell background
    <div className='min-h-screen bg-bg-shell font-ff antialiased'>
      {/* 1. The main grid container: 
          - h-screen: Full viewport height
          - grid grid-cols-[var(--sidebar-width)_1fr]: Creates two columns. 
            The first uses a CSS variable for fixed width (e.g., 250px), the second takes the rest.
          - overflow-hidden: Prevents the whole page from scrolling, ensuring only the content panel scrolls. */}
      <div className='grid grid-cols-[250px_1fr] h-screen overflow-hidden'>
        {/* 2. Column 1: The Sidebar (Fixed and always visible) */}
        <Sidebar />

        {/* 3. Column 2: Main Content Wrapper (The scrollable white panel) 
          - bg-bg-content: Sets the white background for the work area.
          - h-full: Takes full height of the grid cell.
          - overflow-y-auto: CRUCIAL! Allows vertical scrolling only in this area. */}
        <div className=' text-gray-900 bg-neutral-200 h-full overflow-y-auto'>
          <main className='p-8'>
            {/* 4. Children: The screen content (DataGenerationScreen or ChatScreen) */}
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
