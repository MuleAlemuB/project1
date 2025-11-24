import React from "react";
import { Outlet } from "react-router-dom";
import EmployeeSidebar from "../components/employee/EmployeeSidebar";

const EmployeeLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <EmployeeSidebar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;
