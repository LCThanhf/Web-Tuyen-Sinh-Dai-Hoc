import { Navigate } from "react-router-dom";
import type { ReactElement } from "react";

// Kiểm tra quyền truy cập vào route Admin
const PrivateRoute = ({ children, isAdmin }: { children: ReactElement, isAdmin: boolean }) => {
  if (!isAdmin) {
    // Nếu không phải admin, chuyển hướng về trang đăng nhập hoặc trang khác
    return <Navigate to="/login" />;
  }

  return children; // Nếu là admin, cho phép truy cập vào trang Admin
};

export default PrivateRoute;
