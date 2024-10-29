// LayoutWorkspace.tsx
import React, { PropsWithChildren } from 'react';
import SidebarWorkspace from './SidebarWorkspace';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

// Tambahkan interface untuk props
interface LayoutWorkspaceProps {
  children?: React.ReactNode;
}

const LayoutWorkspace: React.FC<LayoutWorkspaceProps> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <SidebarWorkspace />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div>
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto mt-[60px]">
          {children || <Outlet />}
        </main>
      </div>
    </div>
  );
};

export default LayoutWorkspace;