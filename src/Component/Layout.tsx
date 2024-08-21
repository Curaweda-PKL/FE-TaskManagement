import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <div>
          <Navbar />
        </div>
        <main className="flex-1 overflow-y-auto mt-[60px] p-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;