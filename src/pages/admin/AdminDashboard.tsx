import React, { useState } from "react";
import { Layout, Menu, Dropdown, Avatar, Space } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BookOutlined,
  ClusterOutlined,
  TeamOutlined,
  SolutionOutlined,
  MailOutlined,
  FormOutlined,
  CalculatorOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

interface Props {
  onLogout: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  const currentAdmin = {
    name: "Admin Tuyển Sinh",
    avatar: "https://i.pravatar.cc/150?img=1", // Ảnh đại diện cho admin
  };

  // Xác định menu đang active dựa trên url
  const getSelectedKey = () => {
    const path = location.pathname;

    if (path.includes("/admin/schools")) return "schools";
    if (path.includes("/admin/majors")) return "majors";
    if (path.includes("/admin/admission-combinations"))
      return "admission-combinations";

    if (path.includes("/admin/applications-by-school-major"))
      return "applications-by-school-major";

    if (path.includes("/admin/students/proof-management"))
      return "proof-management";
    if (path.includes("/admin/students/application-management"))
      return "application-management";
    if (path.includes("/admin/students/list")) return "student-list";

    if (path.includes("/admin/virtual-filter")) return "virtual-filter";

    if (path.includes("/admin/profile")) return "profile";

    return "dashboard"; // Mặc định là trang chủ admin
  };

  // Xác định open key cho submenu
  const getOpenKeys = () => {
    const path = location.pathname;
    if (path.includes("/admin/students")) return ["student-management"];
    if (
      path.includes("/admin/schools") ||
      path.includes("/admin/majors") ||
      path.includes("/admin/admission-combinations")
    )
      return ["data-management"];
    return [];
  };

  const onMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case "dashboard":
        navigate("/admin/dashboard");
        break;
      case "schools":
        navigate("/admin/schools");
        break;
      case "majors":
        navigate("/admin/majors");
        break;
      case "admission-combinations":
        navigate("/admin/admission-combinations");
        break;
      case "applications-by-school-major":
        navigate("/admin/applications-by-school-major");
        break;
      case "student-list":
        navigate("/admin/students/list");
        break;
      case "proof-management":
        navigate("/admin/students/proof-management");
        break;
      case "application-management":
        navigate("/admin/students/application-management");
        break;
      case "virtual-filter":
        navigate("/admin/virtual-filter");
        break;
      case "profile":
        navigate("/admin/profile");
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
        if (key === "profile") navigate("/admin/profile");
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
            margin: 16,
            color: "white",
            fontSize: 20,
            textAlign: "center",
            lineHeight: "60px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => navigate("/admin/dashboard")}
        >
          Admin Tuyển Sinh
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          defaultOpenKeys={getOpenKeys()}
          onClick={onMenuClick}
        >
          <Menu.Item key="dashboard" icon={<HomeOutlined />}>
            Trang chủ Admin
          </Menu.Item>

          <SubMenu key="data-management" icon={<ClusterOutlined />} title="Quản lý dữ liệu">
            <Menu.Item key="schools" icon={<BookOutlined />}>
              Quản lý Trường
            </Menu.Item>
            <Menu.Item key="majors" icon={<FormOutlined />}>
              Quản lý Ngành
            </Menu.Item>
            <Menu.Item key="admission-combinations" icon={<SolutionOutlined />}>
              Quản lý Tổ hợp xét tuyển
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="applications-by-school-major" icon={<MailOutlined />}>
            DS Nguyện vọng theo Trường/Ngành
          </Menu.Item>

          <SubMenu key="student-management" icon={<TeamOutlined />} title="Quản lý Thí sinh">
            <Menu.Item key="proof-management" icon={<SolutionOutlined />}>
              Duyệt minh chứng
            </Menu.Item>
            <Menu.Item key="application-management" icon={<FormOutlined />}>
              Quản lý nguyện vọng
            </Menu.Item>
            <Menu.Item key="student-list" icon={<UserOutlined />}>
              Danh sách thí sinh
            </Menu.Item>
          </SubMenu>

          <Menu.Item key="virtual-filter" icon={<CalculatorOutlined />}>
            Lọc ảo
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
          <span>Chào mừng Admin đến với Hệ thống Tuyển sinh!</span>
          <Dropdown overlay={profileMenu} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()} style={{ display: "flex", alignItems: "center" }}>
              <Space>
                <Avatar src={currentAdmin.avatar} icon={!currentAdmin.avatar ? <UserOutlined /> : undefined} />
                <span style={{ color: "#333" }}>{currentAdmin.name}</span>
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

export default AdminDashboard;