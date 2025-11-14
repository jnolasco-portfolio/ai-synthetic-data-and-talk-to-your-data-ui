import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

// 1. Define the type for the props: 'children' must be a React element
interface AppLayoutProps {
  children: ReactNode;
}

// AppLayout.tsx (Updated return)
export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="container-grid">
      <aside>
        <Sidebar />
      </aside>
      <main>{children}</main>
      <footer>Course: Prompt Engineering & AI Applications</footer>
    </div>
  );
};
