import React, { useState } from "react";
import { Table, Button, Modal, Descriptions, Input, Select, Space } from "antd";

const { Option } = Select;

interface HoSo {
  key: string;
  cccd: string;
  fullName: string;
  school: string;
  major: string;
  method: string;
  status: string;
  fileUrl: string;
}

const sampleHoSo: HoSo[] = [
  {
    key: "1",
    cccd: "123456789",
    fullName: "Nguyễn Văn A",
    school: "Đại học Bách Khoa",
    major: "CNTT",
    method: "Điểm thi THPT",
    status: "Chờ duyệt",
    fileUrl: "https://example.com/file1.pdf",
  },
  {
    key: "2",
    cccd: "987654321",
    fullName: "Trần Thị B",
    school: "Đại học Kinh Tế",
    major: "Kinh tế quốc tế",
    method: "Học bạ",
    status: "Đã duyệt",
    fileUrl: "https://example.com/file2.pdf",
  },
];

const Status: React.FC = () => {
  const [data, setData] = useState<HoSo[]>(sampleHoSo);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HoSo | null>(null);

  // Lọc dữ liệu
  const filteredData = data.filter(
    (item) =>
      (!filterStatus || item.status === filterStatus) &&
      (item.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.cccd.includes(searchText))
  );

  const columns = [
    { title: "CCCD", dataIndex: "cccd", key: "cccd" },
    { title: "Họ tên", dataIndex: "fullName", key: "fullName" },
    { title: "Trường", dataIndex: "school", key: "school" },
    { title: "Ngành", dataIndex: "major", key: "major" },
    { title: "Phương thức", dataIndex: "method", key: "method" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: HoSo) => (
        <Button
          type="link"
          onClick={() => {
            setSelectedRecord(record);
            setModalVisible(true);
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h3>Xem trạng thái hồ sơ</h3>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm họ tên hoặc CCCD"
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ width: 250 }}
        />
        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 180 }}
          onChange={(value) => setFilterStatus(value)}
        >
          <Option value="Chờ duyệt">Chờ duyệt</Option>
          <Option value="Đã duyệt">Đã duyệt</Option>
          <Option value="Từ chối">Từ chối</Option>
        </Select>
      </Space>

      <Table columns={columns} dataSource={filteredData} rowKey="key" />

      <Modal
        visible={modalVisible}
        title="Chi tiết hồ sơ"
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        {selectedRecord && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Họ tên">{selectedRecord.fullName}</Descriptions.Item>
            <Descriptions.Item label="CCCD">{selectedRecord.cccd}</Descriptions.Item>
            <Descriptions.Item label="Trường">{selectedRecord.school}</Descriptions.Item>
            <Descriptions.Item label="Ngành">{selectedRecord.major}</Descriptions.Item>
            <Descriptions.Item label="Phương thức">{selectedRecord.method}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selectedRecord.status}</Descriptions.Item>
            <Descriptions.Item label="File minh chứng">
              <a href={selectedRecord.fileUrl} target="_blank" rel="noopener noreferrer">
                Xem file
              </a>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Status;
