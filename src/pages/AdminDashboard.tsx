// import React from "react";
// import { Layout, Menu } from "antd";
// import {
//   TeamOutlined,
//   AppstoreOutlined,
//   ExperimentOutlined,
//   FileSearchOutlined,
//   UserSwitchOutlined,
//   LogoutOutlined,
// } from "@ant-design/icons";

// const { Header, Sider, Content } = Layout;

// interface Props {
//   onLogout: () => void;
// }

// const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
//   return (
//     <Layout style={{ minHeight: "100vh" }}>
//       <Sider collapsible>
//         <div style={{ height: 60, margin: 16, color: "white", fontSize: 20, textAlign: "center", lineHeight: "60px", fontWeight: "bold" }}>
//           Tuyển Sinh - Admin
//         </div>
//         <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
//           <Menu.Item key="manageStudents" icon={<TeamOutlined />}>
//             Quản lý thí sinh & hồ sơ
//           </Menu.Item>
//           <Menu.Item key="manageMajors" icon={<AppstoreOutlined />}>
//             Quản lý ngành học & chỉ tiêu
//           </Menu.Item>
//           <Menu.Item key="manageMethods" icon={<ExperimentOutlined />}>
//             Quản lý phương thức xét tuyển
//           </Menu.Item>
//           <Menu.Item key="filter" icon={<FileSearchOutlined />}>
//             Thực hiện lọc ảo
//           </Menu.Item>
//           <Menu.Item key="reports" icon={<UserSwitchOutlined />}>
//             Báo cáo thống kê
//           </Menu.Item>
//           <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
//             Đăng xuất
//           </Menu.Item>
//         </Menu>
//       </Sider>

//       <Layout>
//         <Header style={{ backgroundColor: "#fff", padding: "0 20px", fontWeight: "bold", fontSize: 18 }}>
//           Xin chào, Admin!
//         </Header>
//         <Content style={{ margin: 20, backgroundColor: "#fff", padding: 20 }}>
//           <h3>Trang chủ quản trị</h3>
//           <p>Thông tin tổng quan về công tác tuyển sinh và quản lý hệ thống.</p>
//         </Content>
//       </Layout>
//     </Layout>
//   );
// };

// export default AdminDashboard;






import React, { useState } from "react";
import {
  Layout,
  Menu,
  Table,
  Input,
  Button,
  Select,
  Tabs,
  Space,
  message,
  Modal,
  Descriptions,
  Tag,
} from "antd";
import {
  TeamOutlined,
  BankOutlined,
  AppstoreOutlined,
  FileTextOutlined,
  MailOutlined,
  BarChartOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;
const { Option } = Select;

interface Props {
  onLogout: () => void;
}

// Dữ liệu mẫu
const sampleSchools = [
  { key: "1", code: "BK", name: "Đại học Bách Khoa" },
  { key: "2", code: "KT", name: "Đại học Kinh Tế" },
];

const sampleMajors = [
  { key: "1", schoolCode: "BK", code: "CNTT", name: "Công nghệ thông tin" },
  { key: "2", schoolCode: "BK", code: "DTVT", name: "Điện tử viễn thông" },
  { key: "3", schoolCode: "KT", code: "KTQT", name: "Kinh tế quốc tế" },
];

const sampleCombinations = [
  { key: "1", majorCode: "CNTT", name: "Toán, Lý, Hóa" },
  { key: "2", majorCode: "CNTT", name: "Toán, Lý, Anh" },
  { key: "3", majorCode: "DTVT", name: "Toán, Lý, Hóa" },
  { key: "4", majorCode: "KTQT", name: "Toán, Văn, Anh" },
];

// Hồ sơ mẫu
const sampleProfiles = [
  {
    key: "p1",
    cccd: "123456789",
    fullName: "Nguyễn Văn A",
    schoolCode: "BK",
    majorCode: "CNTT",
    combination: "Toán, Lý, Anh",
    submitBatch: "Đợt 1",
    status: "Chờ duyệt",
    fileUrl: "https://example.com/file1.pdf",
    email: "a.nguyen@example.com",
  },
  {
    key: "p2",
    cccd: "987654321",
    fullName: "Trần Thị B",
    schoolCode: "BK",
    majorCode: "DTVT",
    combination: "Toán, Lý, Hóa",
    submitBatch: "Đợt 1",
    status: "Đã duyệt",
    fileUrl: "https://example.com/file2.pdf",
    email: "b.tran@example.com",
  },
  {
    key: "p3",
    cccd: "555666777",
    fullName: "Lê Văn C",
    schoolCode: "KT",
    majorCode: "KTQT",
    combination: "Toán, Văn, Anh",
    submitBatch: "Đợt 2",
    status: "Từ chối",
    fileUrl: "https://example.com/file3.pdf",
    email: "c.le@example.com",
  },
];

const AdminDashboard: React.FC<Props> = ({ onLogout }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState("1");

  // Bộ lọc hồ sơ
  const [filterSchool, setFilterSchool] = useState<string | undefined>();
  const [filterMajor, setFilterMajor] = useState<string | undefined>();
  const [filterStatus, setFilterStatus] = useState<string | undefined>();

  // Modal xem chi tiết hồ sơ
  const [modalVisible, setModalVisible] = useState(false);
  const [modalProfile, setModalProfile] = useState<any>(null);

  // Lọc hồ sơ theo filter
  const filteredProfiles = sampleProfiles.filter((p) => {
    return (
      (!filterSchool || p.schoolCode === filterSchool) &&
      (!filterMajor || p.majorCode === filterMajor) &&
      (!filterStatus || p.status === filterStatus)
    );
  });

  // Columns bảng hồ sơ
  const profileColumns = [
    { title: "CCCD", dataIndex: "cccd", key: "cccd" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    {
      title: "Trường",
      dataIndex: "schoolCode",
      key: "schoolCode",
      render: (code: string) =>
        sampleSchools.find((s) => s.code === code)?.name || code,
    },
    {
      title: "Ngành",
      dataIndex: "majorCode",
      key: "majorCode",
      render: (code: string) => sampleMajors.find((m) => m.code === code)?.name || code,
    },
    { title: "Tổ hợp", dataIndex: "combination", key: "combination" },
    { title: "Đợt nộp", dataIndex: "submitBatch", key: "submitBatch" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "Chờ duyệt") color = "orange";
        else if (status === "Đã duyệt") color = "green";
        else if (status === "Từ chối") color = "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setModalProfile(record);
              setModalVisible(true);
            }}
          >
            Xem chi tiết
          </Button>
          <Button
            type="primary"
            onClick={() => {
              message.success(`Đã duyệt hồ sơ của ${record.fullName}`);
              // Ở thực tế cập nhật trạng thái trong DB
            }}
            disabled={record.status === "Đã duyệt"}
          >
            Duyệt
          </Button>
          <Button
            danger
            onClick={() => {
              message.success(`Đã từ chối hồ sơ của ${record.fullName}`);
              // Ở thực tế cập nhật trạng thái trong DB
            }}
            disabled={record.status === "Từ chối"}
          >
            Từ chối
          </Button>
          <Button
            onClick={() => {
              message.info(`Gửi email thông báo tới ${record.email}`);
              // Ở thực tế gọi API gửi email
            }}
          >
            Gửi email
          </Button>
        </Space>
      ),
    },
  ];

  // Danh sách ngành theo trường đã chọn để lọc
  const majorsOfSelectedSchool = sampleMajors.filter(
    (m) => m.schoolCode === filterSchool
  );

  // Thống kê hồ sơ theo trạng thái
  const stats = ["Chờ duyệt", "Đã duyệt", "Từ chối"].map((status) => ({
    status,
    count: sampleProfiles.filter((p) => p.status === status).length,
  }));

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
          }}
        >
          Tuyển Sinh - Admin
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeTab]}
          onClick={(e) => setActiveTab(e.key)}
        >
          <Menu.Item key="1" icon={<BankOutlined />}>
            Quản lý trường, ngành, tổ hợp
          </Menu.Item>
          <Menu.Item key="2" icon={<TeamOutlined />}>
            Quản lý hồ sơ
          </Menu.Item>
          <Menu.Item key="3" icon={<FileTextOutlined />}>
            Lọc ảo
          </Menu.Item>
          <Menu.Item key="4" icon={<BarChartOutlined />}>
            Thống kê hồ sơ
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
            Đăng xuất
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
          }}
        >
          Xin chào, Admin!
        </Header>
        <Content style={{ margin: 20, backgroundColor: "#fff", padding: 20 }}>
          {activeTab === "1" && (
            <>
              <h2>Quản lý trường, ngành, tổ hợp xét tuyển</h2>
              {/* Thêm danh sách và form quản lý trường, ngành, tổ hợp */}
              <p>(Demo chưa triển khai chi tiết phần này)</p>
            </>
          )}

          {activeTab === "2" && (
            <>
              <h2>Quản lý hồ sơ thí sinh</h2>

              <Space style={{ marginBottom: 16 }}>
                <Select
                  placeholder="Chọn trường"
                  allowClear
                  style={{ width: 160 }}
                  onChange={(value) => {
                    setFilterSchool(value);
                    setFilterMajor(undefined);
                  }}
                  value={filterSchool}
                >
                  {sampleSchools.map((s) => (
                    <Option key={s.code} value={s.code}>
                      {s.name}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Chọn ngành"
                  allowClear
                  style={{ width: 160 }}
                  onChange={(value) => setFilterMajor(value)}
                  value={filterMajor}
                  disabled={!filterSchool}
                >
                  {majorsOfSelectedSchool.map((m) => (
                    <Option key={m.code} value={m.code}>
                      {m.name}
                    </Option>
                  ))}
                </Select>

                <Select
                  placeholder="Trạng thái"
                  allowClear
                  style={{ width: 140 }}
                  onChange={(value) => setFilterStatus(value)}
                  value={filterStatus}
                >
                  <Option value="Chờ duyệt">Chờ duyệt</Option>
                  <Option value="Đã duyệt">Đã duyệt</Option>
                  <Option value="Từ chối">Từ chối</Option>
                </Select>

                <Input.Search
                  placeholder="Tìm họ tên hoặc CCCD"
                  onSearch={() => {}}
                  style={{ width: 200 }}
                />
              </Space>

              <Table
                columns={profileColumns}
                dataSource={filteredProfiles}
                pagination={{ pageSize: 5 }}
              />

              {/* Modal xem chi tiết hồ sơ */}
              <Modal
                title="Chi tiết hồ sơ thí sinh"
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                footer={null}
                width={700}
              >
                {modalProfile && (
                  <Descriptions bordered column={1}>
                    <Descriptions.Item label="Họ tên">
                      {modalProfile.fullName}
                    </Descriptions.Item>
                    <Descriptions.Item label="CCCD">
                      {modalProfile.cccd}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trường">
                      {sampleSchools.find(
                        (s) => s.code === modalProfile.schoolCode
                      )?.name || modalProfile.schoolCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngành">
                      {sampleMajors.find(
                        (m) => m.code === modalProfile.majorCode
                      )?.name || modalProfile.majorCode}
                    </Descriptions.Item>
                    <Descriptions.Item label="Tổ hợp">
                      {modalProfile.combination}
                    </Descriptions.Item>
                    <Descriptions.Item label="Đợt nộp">
                      {modalProfile.submitBatch}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      {modalProfile.status}
                    </Descriptions.Item>
                    <Descriptions.Item label="File minh chứng">
                      <a href={modalProfile.fileUrl} target="_blank" rel="noreferrer">
                        Xem file
                      </a>
                    </Descriptions.Item>
                  </Descriptions>
                )}
              </Modal>
            </>
          )}

          {activeTab === "3" && (
            <>
              <h2>Lọc ảo</h2>
              <Button
                type="primary"
                onClick={() => message.success("Chạy lọc ảo thành công!")}
              >
                Chạy lọc ảo
              </Button>
              {/* TODO: Hiển thị kết quả lọc ảo */}
            </>
          )}

          {activeTab === "4" && (
            <>
              <h2>Thống kê hồ sơ</h2>
              <Table
                dataSource={stats}
                columns={[
                  {
                    title: "Trạng thái",
                    dataIndex: "status",
                    key: "status",
                  },
                  {
                    title: "Số lượng hồ sơ",
                    dataIndex: "count",
                    key: "count",
                  },
                ]}
                pagination={false}
                rowKey="status"
              />
            </>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
