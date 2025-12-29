import React, { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import EmployeeSidebar from "../components/employee/EmployeeSidebar";

const EmployeeLayout = () => {
  const location = useLocation();

  // Debug logging to see how many times this renders
  useEffect(() => {
    console.log("🔄 EmployeeLayout MOUNTED for path:", location.pathname);
    return () => console.log("🗑️ EmployeeLayout UNMOUNTED");
  }, [location.pathname]);

  console.log("📝 EmployeeLayout RENDER");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - check if this component has issues */}
      <EmployeeSidebar key="employee-sidebar" />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default EmployeeLayout;