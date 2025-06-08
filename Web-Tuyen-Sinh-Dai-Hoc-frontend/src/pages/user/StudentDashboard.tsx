

import React, { useState, useEffect } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  HomeOutlined,
  UserAddOutlined,
  ProfileOutlined,
  SearchOutlined,
  SettingOutlined,
  LogoutOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

interface Props {
  onLogout: () => void;
}

const StudentDashboard: React.FC<Props> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Sinh viên",
    avatar: undefined as string | undefined,
  });

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("userData");
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setCurrentUser({
          name: user.fullName || "Sinh viên",
          avatar: user.avatar || undefined,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // Xác định menu đang active dựa trên url
  const getSelectedKey = () => {
    const path = location.pathname;

    if (path.includes("/student/info-registration/personal")) return "personal";
    if (path.includes("/student/info-registration/priority")) return "priority";
    if (path.includes("/student/info-registration/scores")) return "scores";
    if (path.includes("/student/info-registration/achievements")) return "achievements";

    if (path.includes("/student/register-nguyenvong")) return "register-nguyenvong";
    if (path.includes("/student/status")) return "status";
    if (path.includes("/student/results")) return "results";
    if (path.includes("/student/profile")) return "profile";

    if (path.includes("/student/dashboard")) return "dashboard";

    return "dashboard";
  };

  // Xác định open key cho submenu
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.includes("/student/info-registration")) return ["info-registration"];
    return [];
  };

  const onMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "personal":
        navigate("/student/info-registration/personal");
        break;
      case "priority":
        navigate("/student/info-registration/priority");
        break;
      case "scores":
        navigate("/student/info-registration/scores");
        break;
      case "achievements":
        navigate("/student/info-registration/achievements");
        break;
      case "register-nguyenvong":
        navigate("/student/register-nguyenvong");
        break;
      case "status":
        navigate("/student/status");
        break;
      case "results":
        navigate("/student/results");
        break;
      case "dashboard":
        navigate("/student/dashboard");
        break;
      case "profile":
        navigate("/student/profile");
        break;
      case "logout":
        onLogout();
        break;
      default:
        break;
    }
  };

  const profileMenu = (
    <Menu
      onClick={({ key }) => {
        if (key === "profile") navigate("/student/profile");
        else if (key === "logout") onLogout();
      }}
    >
      <Menu.Item key="profile" icon={<SettingOutlined />}>
        Thông tin cá nhân
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
  <div
    style={{
      height: 60,
       margin: "5px 16px 16px 16px",
      color: "white",
      fontSize: 22,
      textAlign: "center",
      lineHeight: "50px",
      fontWeight: "bold",
      cursor: "pointer",
      
    }}
    onClick={() => navigate("/admin/dashboard")}
  >
    {!collapsed && "Tuyển Sinh"}
  </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          defaultOpenKeys={getOpenKeys()}
          onClick={onMenuClick}
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            Trang chủ
          </Menu.Item>

          <SubMenu key="info-registration" icon={<SolutionOutlined />} title="Thông tin xét tuyển">
            <Menu.Item key="personal">Thông tin cá nhân</Menu.Item>
            <Menu.Item key="priority">Thông tin ưu tiên</Menu.Item>
            <Menu.Item key="scores">Điểm thi & Học bạ</Menu.Item>
            <Menu.Item key="achievements">Thành tích & Chứng chỉ</Menu.Item>
          </SubMenu>

          <Menu.Item key="register-nguyenvong" icon={<UserAddOutlined />}>
            Đăng ký nguyện vọng
          </Menu.Item>
          <Menu.Item key="status" icon={<ProfileOutlined />}>
            Xem trạng thái hồ sơ
          </Menu.Item>
          <Menu.Item key="results" icon={<SearchOutlined />}>
            Tra cứu kết quả tuyển sinh
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout>
        <Header
          style={{
            backgroundColor: "#fff",
            padding: "0 20px",
            fontWeight: "bold",
            fontSize: 18,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Chào mừng bạn đến với Hệ thống Tuyển sinh!</span>
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()} style={{ display: "flex", alignItems: "center" }}>
              <Space>
                <Avatar src={currentUser.avatar} icon={!currentUser.avatar ? <UserOutlined /> : undefined} />
                <span style={{ color: "#333" }}>{currentUser.name}</span>
              </Space>
            </a>
          </Dropdown>
        </Header>
        <Content style={{ margin: 20, backgroundColor: "#fff", padding: 20, minHeight: 500 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentDashboard;
