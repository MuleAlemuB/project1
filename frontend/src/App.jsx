// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import DeptHeadLayout from "./layouts/DeptHeadLayout";
import EmployeeLayout from "./layouts/EmployeeLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import VacanciesHome from "./pages/VacanciesHome";
import About from "./components/public/About";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageEmployees from "./pages/admin/ManageEmployees";
import ManageDepartments from "./pages/admin/ManageDepartments";
import AdminVacancies from "./pages/admin/AdminVacancies";
import AdminReports from "./pages/admin/AdminReports";
import AdminNotifications from "./pages/admin/AdminNotifications";
import AdminProfilePage from "./components/admin/ProfilePage";
import EditEmployeeForm from "./pages/admin/EditEmployeeForm";
import CreateEmployeeForm from "./pages/admin/CreateAccount";
import ViewEmployee from "./pages/admin/ViewEmployee";

// Dept Head Pages
import DeptHeadDashboard from "./pages/deptHead/DeptHeadDashboard";
import DeptHeadProfile from "./pages/deptHead/DeptHeadProfile";
import EmployeesPage from "./pages/deptHead/DeptHeadEmployees";
import AttendancePage from "./pages/deptHead/DeptHeadAttendance";
import RequisitionPage from "./pages/deptHead/DeptHeadRequisition";
import LeaveRequestsPage from "./pages/deptHead/DeptHeadLeaveRequests";
import NotificationsPage from "./pages/deptHead/DeptHeadNotifications";

// Employee Pages
import EmployeeDashboard from "./pages/employee/EmployeeDashboard";
import EmployeeLeave from "./pages/employee/EmployeeLeave";
import EmployeeNotifications from "./pages/employee/EmployeeNotifications";
import EmployeeProfile from "./pages/employee/EmployeeProfile";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/vacancies" element={<VacanciesHome />} />
        <Route path="/about" element={<About />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />


        {/* Admin Routes */}
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="manage-employees" element={<ManageEmployees />} />
          <Route path="manage-departments" element={<ManageDepartments />} />
          <Route path="vacancies" element={<AdminVacancies />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="profile" element={<AdminProfilePage />} />
          <Route path="edit-employee/:id" element={<EditEmployeeForm />} />
          <Route path="create-employee" element={<CreateEmployeeForm />} />
          <Route path="view-employee/:id" element={<ViewEmployee />} />
        </Route>

        {/* Dept Head Routes */}
        <Route path="/departmenthead/*" element={<DeptHeadLayout />}>
          <Route index element={<DeptHeadDashboard />} />
          <Route path="dashboard" element={<DeptHeadDashboard />} />
          <Route path="profile" element={<DeptHeadProfile />} />
          <Route path="employees" element={<EmployeesPage />} />
          <Route path="attendance" element={<AttendancePage />} />
          <Route path="requisition" element={<RequisitionPage />} />
          <Route path="leaverequests" element={<LeaveRequestsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        {/* Employee Routes without sidebar */}
<Route path="/employee">
  <Route index element={<EmployeeDashboard />} />
  <Route path="dashboard" element={<EmployeeDashboard />} />
  <Route path="leave" element={<EmployeeLeave />} />
  <Route path="profile" element={<EmployeeProfile />} />
  <Route path="/employee/notifications" element={<EmployeeNotifications />} /> {/* New route */}
</Route>

        {/* Redirect unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer 
        position="top-right"
        autoClose={5000}  // 5 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </Router>
  );
}

export default App;
