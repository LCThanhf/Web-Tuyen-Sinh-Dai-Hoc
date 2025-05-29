// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import StudentDashboard from "./pages/user/StudentDashboard";
// import AdminDashboard from "./pages/admin/AdminDashboard";

// import RegisterNguyenVong from "./pages/user/RegisterNguyenVong";
// import Status from "./pages/user/Status";
// import Results from "./pages/user/Results";

// import StudentDashboardPage from "./pages/user/StudentDashboardPage";
// import PersonalInfo from "./pages/user/InfoRegistration/Personal";
// import InfoPriority from "./pages/user/InfoRegistration/Priority";
// import Scores from "./pages/user/InfoRegistration/Scores";
// import AchievementsCerts from "./pages/user/InfoRegistration/Achievements";
// import StudentProfilePage from "./pages/user/StudentProfilePage";






// const App: React.FC = () => {
//   const userRole = localStorage.getItem("userRole");

//   const handleLogin = (role: string) => {
//     localStorage.setItem("userRole", role);
//     window.location.href = role === "admin" ? "/admin" : "/student/dashboard";
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("userRole");
//     window.location.href = "/login";
//   };

//   return (
//     <Router>
//       <Routes>
//         <Route
//           path="/login"
//           element={
//             userRole ? (
//               <Navigate to={userRole === "admin" ? "/admin" : "/student/dashboard"} replace />
//             ) : (
//               <Login onLogin={handleLogin} />
//             )
//           }
//         />

//         <Route
//           path="/register"
//           element={
//             userRole ? (
//               <Navigate to={userRole === "admin" ? "/admin" : "/student/dashboard"} replace />
//             ) : (
//               <Register />
//             )
//           }
//         />

//         <Route
//           path="/student/*"
//           element={
//             userRole === "student" ? (
//               <StudentDashboard onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         >
//           <Route index element={<Navigate to="dashboard" replace />} />
//           <Route path="dashboard" element={<StudentDashboardPage />} />

//           {/* Các route con info-registration */}
//           <Route path="info-registration/*">
//             <Route index element={<Navigate to="personal" replace />} />
//             <Route path="personal" element={<PersonalInfo />} />
//             <Route path="priority" element={<InfoPriority />} />
//             <Route path="scores" element={<Scores />} />
//             <Route path="achievements" element={<AchievementsCerts />} />
//           </Route>

//           <Route path="register-nguyenvong" element={<RegisterNguyenVong />} />
//           <Route path="status" element={<Status />} />
//           <Route path="results" element={<Results />} />
//           <Route path="profile" element={<StudentProfilePage />} />
//         </Route>

//         <Route
//           path="/admin/*"
//           element={
//             userRole === "admin" ? (
//               <AdminDashboard onLogout={handleLogout} />
//             ) : (
//               <Navigate to="/login" replace />
//             )
//           }
//         />
//         <Route
//           path="/"
//           element={
//             <Navigate
//               to={userRole ? (userRole === "admin" ? "/admin" : "/student/dashboard") : "/login"}
//               replace
//             />
//           }
//         />


//       </Routes>
//     </Router>
//   );
// };

// export default App;



import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

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
import StudentProfilePage from "./pages/user/StudentProfilePage";

// IMPORT CÁC TRANG ADMIN MỚI TẠI ĐÂY
import AdminHomePage from "./pages/admin/AdminHomePage"; // Trang chủ cho admin (tùy chọn)
import ManageSchoolsPage from "./pages/admin/ManageSchoolsPage";
import ManageMajorsPage from "./pages/admin/ManageMajorsPage";
import ManageAdmissionCombinationsPage from "./pages/admin/ManageAdmissionCombinationsPage"; // Sẽ tạo tiếp
import ApplicationsBySchoolMajorPage from "./pages/admin/ApplicationsBySchoolMajorPage"; // Sẽ tạo tiếp
import ProofManagementPage from "./pages/admin/ProofManagementPage"; // Sẽ tạo tiếp
import AdminManageApplicationsPage from "./pages/admin/AdminManageApplicationsPage"; // Sẽ tạo tiếp
import StudentListPage from "./pages/admin/StudentListPage"; // Sẽ tạo tiếp
import VirtualFilterPage from "./pages/admin/VirtualFilterPage"; // Sẽ tạo tiếp
import AdminProfilePage from "./pages/admin/AdminProfilePage"; // Trang thông tin cá nhân admin (tùy chọn)


const App: React.FC = () => {
  const userRole = localStorage.getItem("userRole");

  const handleLogin = (role: string) => {
    localStorage.setItem("userRole", role);
    window.location.href = role === "admin" ? "/admin" : "/student/dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    window.location.href = "/login";
  };

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

          {/* Các route con info-registration */}
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
          <Route path="profile" element={<StudentProfilePage />} />
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
          {/* CÁC ROUTE CON CỦA ADMIN DASHBOARD */}
          <Route index element={<Navigate to="dashboard" replace />} /> {/* Mặc định điều hướng đến trang chủ Admin */}
          <Route path="dashboard" element={<AdminHomePage />} />

          {/* Quản lý dữ liệu */}
          <Route path="schools" element={<ManageSchoolsPage />} />
          <Route path="majors" element={<ManageMajorsPage />} />
          <Route path="admission-combinations" element={<ManageAdmissionCombinationsPage />} />

          {/* Nguyện vọng theo trường/ngành */}
          <Route path="applications-by-school-major" element={<ApplicationsBySchoolMajorPage />} />

          {/* Quản lý thí sinh */}
          <Route path="students/proof-management" element={<ProofManagementPage />} />
          <Route path="students/application-management" element={<AdminManageApplicationsPage />} />
          <Route path="students/list" element={<StudentListPage />} />

          {/* Lọc ảo */}
          <Route path="virtual-filter" element={<VirtualFilterPage />} />

          {/* Thông tin cá nhân Admin */}
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
        {/* Route 404 (optional) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}

      </Routes>
    </Router>
  );
};

export default App;