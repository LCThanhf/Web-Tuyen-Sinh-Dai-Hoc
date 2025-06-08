import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { authApi } from "./services/authApi";

import Login from "./pages/Login";
import Register from "./pages/Register";
import StudentDashboard from "./pages/user/StudentDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

import RegisterNguyenVong from "./pages/user/RegisterNguyenVong";
import Status from "./pages/user/Status";
import Results from "./pages/user/Results";

import StudentDashboardPage from "./pages/user/StudentDashboardPage";
import PersonalInfo from "./pages/user/InfoRegistration/Personal";
import InfoPriority from "./pages/user/InfoRegistration/Priority";
import Scores from "./pages/user/InfoRegistration/Scores";
import AchievementsCerts from "./pages/user/InfoRegistration/Achievements";
import Profile from "./pages/user/Profile";

// IMPORT CÁC TRANG ADMIN
import AdminHomePage from "./pages/admin/AdminHomePage";
import ManageSchoolsPage from "./pages/admin/ManageSchoolsPage";
import ManageMajorsPage from "./pages/admin/ManageMajorsPage";
import ManageAdmissionCombinationsPage from "./pages/admin/ManageAdmissionCombinationsPage";
import ApplicationsBySchoolMajorPage from "./pages/admin/ApplicationsBySchoolMajorPage";
import StudentListPage from "./pages/admin/StudentListPage";
import ProofManagementPage from "./pages/admin/ProofManagementPage";
// Remove the incorrect import on line 41 and keep only this one:
import AdminManageApplicationsPage from "./pages/admin/AdminManageApplicationsPage";
import VirtualFilterPage from "./pages/admin/VirtualFilterPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null); // Kept for future use by child components
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication on app load
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUserData = localStorage.getItem("userData");
      
      if (token && storedUserData) {
        try {
          // Verify token is still valid by calling profile endpoint
          const response = await authApi.getProfile();
          const user = response.user;
          
          setUserData(user);
          const role = user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? 'admin' : 'student';
          setUserRole(role);
          
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("userData");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = (role: string, user: any) => {
    setUserRole(role);
    setUserData(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setUserRole(null);
    setUserData(null);
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Đang tải...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            userRole ? (
              <Navigate to={userRole === "admin" ? "/admin" : "/student/dashboard"} replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/register"
          element={
            userRole ? (
              <Navigate to={userRole === "admin" ? "/admin" : "/student/dashboard"} replace />
            ) : (
              <Register />
            )
          }
        />

        <Route
          path="/student/*"
          element={
            userRole === "student" ? (
              <StudentDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />

          <Route path="info-registration/*">
            <Route index element={<Navigate to="personal" replace />} />
            <Route path="personal" element={<PersonalInfo />} />
            <Route path="priority" element={<InfoPriority />} />
            <Route path="scores" element={<Scores />} />
            <Route path="achievements" element={<AchievementsCerts />} />
          </Route>

          <Route path="register-nguyenvong" element={<RegisterNguyenVong />} />
          <Route path="status" element={<Status />} />
          <Route path="results" element={<Results />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route
          path="/admin/*"
          element={
            userRole === "admin" ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminHomePage />} />
          <Route path="schools" element={<ManageSchoolsPage />} />
          <Route path="majors" element={<ManageMajorsPage />} />
          <Route path="admission-combinations" element={<ManageAdmissionCombinationsPage />} />
          <Route path="applications-by-school-major" element={<ApplicationsBySchoolMajorPage />} />
          <Route path="students/list" element={<StudentListPage />} />
          <Route path="students/proof-management" element={<ProofManagementPage />} />
          <Route path="students/application-management" element={<AdminManageApplicationsPage />} />
          <Route path="virtual-filter" element={<VirtualFilterPage />} />
          <Route path="profile" element={<AdminProfilePage />} />
        </Route>

        <Route
          path="/"
          element={
            <Navigate
              to={userRole ? (userRole === "admin" ? "/admin" : "/student/dashboard") : "/login"}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;