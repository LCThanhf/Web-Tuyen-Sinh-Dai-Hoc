// // import React from "react";
// // import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// // import Login from "./pages/Login";
// // import StudentDashboard from "./pages/StudentDashboard";
// // import AdminDashboard from "./pages/AdminDashboard";
// // import RegisterNguyenVong from "./pages/RegisterNguyenVong";
// // import Status from "./pages/Status";
// // import Results from "./pages/Results";
// // import Profile from "./pages/Profile";

// // const App: React.FC = () => {
// //   // Lấy role từ localStorage
// //   const userRole = localStorage.getItem("userRole");

// //   const handleLogin = (role: string) => {
// //     localStorage.setItem("userRole", role);
// //     window.location.href = role === "admin" ? "/admin" : "/student/register";
// //   };

// //   const handleLogout = () => {
// //     localStorage.removeItem("userRole");
// //     window.location.href = "/login";
// //   };

// //   return (
// //     <Router>
// //       <Routes>
// //         {/* Trang đăng nhập */}
// //         <Route
// //           path="/login"
// //           element={
// //             userRole ? (
// //               <Navigate to={userRole === "admin" ? "/admin" : "/student/register"} replace />
// //             ) : (
// //               <Login onLogin={handleLogin} />
// //             )
// //           }
// //         />

// //         {/* Dashboard thí sinh với các route con */}
// //         <Route
// //           path="/student/*"
// //           element={
// //             userRole === "student" ? (
// //               <StudentDashboard onLogout={handleLogout} />
// //             ) : (
// //               <Navigate to="/login" replace />
// //             )
// //           }
// //         >
// //           <Route path="register" element={<RegisterNguyenVong />} />
// //           <Route path="status" element={<Status />} />
// //           <Route path="results" element={<Results />} />
// //           <Route path="profile" element={<Profile />} />
// //           {/* Route mặc định khi truy cập /student */}
// //           <Route index element={<Navigate to="register" replace />} />
// //         </Route>

// //         {/* Dashboard admin (chưa có route con demo) */}
// //         <Route
// //           path="/admin/*"
// //           element={
// //             userRole === "admin" ? (
// //               <AdminDashboard onLogout={handleLogout} />
// //             ) : (
// //               <Navigate to="/login" replace />
// //             )
// //           }
// //         />

// //         {/* Redirect root */}
// //         <Route
// //           path="/"
// //           element={
// //             <Navigate
// //               to={userRole ? (userRole === "admin" ? "/admin" : "/student/register") : "/login"}
// //               replace
// //             />
// //           }
// //         />
// //       </Routes>
// //     </Router>
// //   );
// // };

// // export default App;



// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// import Login from "./pages/Login";
// import Register from "./pages/Register"; // <--- THÊM DÒNG NÀY
// import StudentDashboard from "./pages/StudentDashboard";
// import AdminDashboard from "./pages/AdminDashboard";

// // Các trang đã có
// import RegisterNguyenVong from "./pages/RegisterNguyenVong";
// import Status from "./pages/Status";
// import Results from "./pages/Results";

// // Các trang mới và cập nhật
// import StudentDashboardPage from "./pages/StudentDashboardPage";
// import StudentInfoRegistrationPage from "./pages/StudentInfoRegistrationPage";
// import AchievementCertificatesPage from "./pages/AchievementCertificatesPage";
// import StudentProfilePage from "./pages/StudentProfilePage";

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
//         {/* Trang đăng nhập */}
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

//         {/* Trang đăng ký */}
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

//         {/* Dashboard thí sinh */}
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
//           <Route path="info-registration" element={<StudentInfoRegistrationPage />} />
//           <Route path="achievements-certs" element={<AchievementCertificatesPage />} />
//           <Route path="register-nguyenvong" element={<RegisterNguyenVong />} />
//           <Route path="status" element={<Status />} />
//           <Route path="results" element={<Results />} />
//           <Route path="profile" element={<StudentProfilePage />} />
//         </Route>

//         {/* Dashboard admin */}
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

//         {/* Redirect root */}
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
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import RegisterNguyenVong from "./pages/RegisterNguyenVong";
import Status from "./pages/Status";
import Results from "./pages/Results";

import StudentDashboardPage from "./pages/StudentDashboardPage";
import PersonalInfo from "./pages/InfoRegistration/Personal";
import InfoPriority from "./pages/InfoRegistration/Priority";
import Scores from "./pages/InfoRegistration/Scores";
import AchievementsCerts from "./pages/InfoRegistration/Achievements";
import StudentProfilePage from "./pages/StudentProfilePage";

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
        />

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
