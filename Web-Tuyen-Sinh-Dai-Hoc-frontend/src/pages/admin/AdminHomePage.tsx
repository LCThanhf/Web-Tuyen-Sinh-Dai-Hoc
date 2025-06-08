// ./pages/admin/AdminHomePage.tsx
import React from 'react';
import { Typography } from 'antd';

const { Title, Text } = Typography;

const AdminHomePage: React.FC = () => {
  return (
    <div>
       <Title level={3}>Chào mừng bạn đến với trang chủ Admin!</Title>
      <Text>Bạn có thể sử dụng thanh điều hướng bên trái để quản lý hệ thống.</Text>
    </div>
  );
};

export default AdminHomePage;