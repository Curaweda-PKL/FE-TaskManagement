import React from 'react';
import SidebarWorkspace from './SidebarWorkspace';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const LayoutWorkspace: React.FC = () => {
  return (
    <div className="flex h-screen">
      <SidebarWorkspace />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div>
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto mt-[72px] p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default LayoutWorkspace;