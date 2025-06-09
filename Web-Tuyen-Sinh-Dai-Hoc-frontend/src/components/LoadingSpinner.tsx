import React from "react";
import { Spin } from "antd";

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      <Spin size="large" tip="Đang tải..." />
    </div>
  );
};

export default LoadingSpinner;