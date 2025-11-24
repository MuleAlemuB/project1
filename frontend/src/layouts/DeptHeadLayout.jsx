import React from 'react';
import { Outlet } from 'react-router-dom';
import DeptHeadSidebar from '../components/deptHead/DeptHeadSidebar';

const DeptHeadLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DeptHeadSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DeptHeadLayout;
