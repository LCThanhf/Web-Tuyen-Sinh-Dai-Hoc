import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Tag,
  message,
  Typography,
  Descriptions,
  Divider,
  Upload,
  Spin,
  Select,
} from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  LoadingOutlined,
  MailOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { UploadFile } from 'antd/lib/upload/interface';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Định nghĩa kiểu dữ liệu cho một thí sinh/hồ sơ xét tuyển
interface Applicant {
  id: string; // ID hồ sơ
  studentId: string; // ID sinh viên (tài khoản đăng nhập)
  fullName: string;
  dob: string; // Date of Birth
  email: string;
  phone: string;
  nationalId: string; // CCCD
  majorRegistered: string; // Ngành đã đăng ký (ví dụ: Khoa học Máy tính - ĐH Bách Khoa)
  applicationStatus: 'Chờ duyệt' | 'Đã duyệt' | 'Từ chối';
  submissionDate: string;
  proofs: {
    personalInfoProof: UploadFile[]; // Minh chứng thông tin cá nhân (CCCD, Giấy khai sinh)
    scoreProof: UploadFile[]; // Minh chứng điểm thi (TN THPT, ĐGNL/TĐ, Học bạ)
    priorityProof: UploadFile[]; // Minh chứng ưu tiên (Giấy chứng nhận đối tượng ưu tiên)
    achievementProof: UploadFile[]; // Minh chứng thành tích (HSG, chứng chỉ Tiếng Anh)
  };
  rejectionReason?: string; // Lý do từ chối
}

// Giả lập dữ liệu minh chứng (sẽ được thay thế bằng API)
// Lưu ý: Trong thực tế, UploadFile['url'] sẽ là URL thật của file trên server/cloud storage
const dummyProofs = {
  personalInfoProof: [{ uid: '1', name: 'cccd_front.jpg', status: 'done', url: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=CCCD_truoc' }, { uid: '2', name: 'cccd_back.jpg', status: 'done', url: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=CCCD_sau' }],
  scoreProof: [{ uid: '3', name: 'diem_thpt_2023.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }, { uid: '4', name: 'hocba_ky1_12.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }],
  priorityProof: [],
  achievementProof: [{ uid: '5', name: 'chung_chi_ielts.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }],
};

const dummyApplicants: Applicant[] = [
  {
    id: 'H001',
    studentId: 'SV001',
    fullName: 'Nguyễn Văn A',
    dob: '15/01/2006',
    email: 'nguyenvana@example.com',
    phone: '0912345678',
    nationalId: '001122334455',
    majorRegistered: 'Khoa học Máy tính - Đại học Bách Khoa Hà Nội',
    applicationStatus: 'Chờ duyệt',
    submissionDate: '2024-05-20',
    proofs: { ...dummyProofs, priorityProof: [{ uid: '6', name: 'giay_chung_nhan_uu_tien.pdf', status: 'done', url: 'https://www.africau.edu/images/default/sample.pdf' }] },
  },
  {
    id: 'H002',
    studentId: 'SV002',
    fullName: 'Trần Thị B',
    dob: '20/03/2006',
    email: 'tranthib@example.com',
    phone: '0987654321',
    nationalId: '002233445566',
    majorRegistered: 'Kinh tế Quốc tế - Đại học Ngoại Thương',
    applicationStatus: 'Đã duyệt',
    submissionDate: '2024-05-18',
    proofs: { ...dummyProofs },
  },
  {
    id: 'H003',
    studentId: 'SV003',
    fullName: 'Lê Văn C',
    dob: '01/07/2006',
    email: 'levanc@example.com',
    phone: '0901234567',
    nationalId: '003344556677',
    majorRegistered: 'Công nghệ thông tin - Đại học Quốc gia Hà Nội',
    applicationStatus: 'Từ chối',
    submissionDate: '2024-05-15',
    proofs: { ...dummyProofs },
    rejectionReason: 'Minh chứng học bạ không hợp lệ.',
  },
  {
    id: 'H004',
    studentId: 'SV004',
    fullName: 'Phạm Thị D',
    dob: '10/02/2006',
    email: 'phamthid@example.com',
    phone: '0911223344',
    nationalId: '004455667788',
    majorRegistered: 'Kỹ thuật Điện tử Viễn thông - Đại học Bách Khoa Hà Nội',
    applicationStatus: 'Chờ duyệt',
    submissionDate: '2024-05-22',
    proofs: { ...dummyProofs },
  },
];

const ProofManagementPage: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập API call
      setApplicants(dummyApplicants);
      setLoading(false);
    };
    fetchApplicants();
  }, []);

  // Lọc và tìm kiếm hồ sơ
  const filteredApplicants = useMemo(() => {
    let result = applicants;
    if (filterStatus) {
      result = result.filter(app => app.applicationStatus === filterStatus);
    }
    if (searchText) {
      result = result.filter(app =>
        app.fullName.toLowerCase().includes(searchText.toLowerCase()) ||
        app.studentId.toLowerCase().includes(searchText.toLowerCase()) ||
        app.nationalId.toLowerCase().includes(searchText.toLowerCase())
      );
    }
    return result;
  }, [applicants, filterStatus, searchText]);

  const getStatusColor = (status: Applicant['applicationStatus']) => {
    switch (status) {
      case 'Đã duyệt': return 'green';
      case 'Chờ duyệt': return 'orange';
      case 'Từ chối': return 'red';
      default: return 'default';
    }
  };

  // Mở modal xem chi tiết
  const handleViewDetails = (record: Applicant) => {
    setSelectedApplicant(record);
    // Nếu hồ sơ đã từ chối, set lý do vào form để hiển thị
    if (record.applicationStatus === 'Từ chối' && record.rejectionReason) {
      form.setFieldsValue({ rejectionReason: record.rejectionReason });
    } else {
      form.resetFields(); // Reset form nếu không phải hồ sơ từ chối
    }
    setIsModalVisible(true);
  };

  // Cập nhật trạng thái hồ sơ
  const handleUpdateStatus = async (status: 'Đã duyệt' | 'Từ chối') => {
    if (!selectedApplicant) return;

    let rejectionReason: string | undefined = undefined;
    if (status === 'Từ chối') {
      try {
        const values = await form.validateFields();
        rejectionReason = values.rejectionReason;
        if (!rejectionReason) {
          message.error('Vui lòng nhập lý do từ chối!');
          return;
        }
      } catch (errorInfo) {
        message.error('Vui lòng nhập lý do từ chối!');
        return;
      }
    }

    // Giả lập API call để cập nhật trạng thái
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập độ trễ

    setApplicants(prevApplicants =>
      prevApplicants.map(app =>
        app.id === selectedApplicant.id
          ? { ...app, applicationStatus: status, rejectionReason: rejectionReason }
          : app
      )
    );
    message.success(`Hồ sơ của ${selectedApplicant.fullName} đã được chuyển sang trạng thái: ${status}!`);

    // Gửi email thông báo (cần API backend)
    try {
      // Ví dụ: await axios.post('/api/send-email', {
      //   to: selectedApplicant.email,
      //   subject: `Thông báo trạng thái hồ sơ của bạn - ${status}`,
      //   body: `Kính gửi ${selectedApplicant.fullName},\n\nHồ sơ của bạn đã được cập nhật trạng thái thành: ${status}.\n${rejectionReason ? `Lý do: ${rejectionReason}` : ''}\n\nTrân trọng!`,
      // });
      message.info('Đã gửi email thông báo cho thí sinh.');
    } catch (error) {
      message.error('Không thể gửi email thông báo.');
    }

    setLoading(false);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Mã Hồ sơ',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: Applicant, b: Applicant) => a.id.localeCompare(b.id),
    },
    {
      title: 'Mã SV',
      dataIndex: 'studentId',
      key: 'studentId',
      sorter: (a: Applicant, b: Applicant) => a.studentId.localeCompare(b.studentId),
    },
    {
      title: 'Họ và tên',
      dataIndex: 'fullName',
      key: 'fullName',
      sorter: (a: Applicant, b: Applicant) => a.fullName.localeCompare(b.fullName),
    },
    {
      title: 'Ngành đã ĐK',
      dataIndex: 'majorRegistered',
      key: 'majorRegistered',
    },
    {
      title: 'Ngày nộp',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      sorter: (a: Applicant, b: Applicant) => a.submissionDate.localeCompare(b.submissionDate),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'applicationStatus',
      key: 'applicationStatus',
      render: (status: Applicant['applicationStatus']) => (
        <Tag color={getStatusColor(status)} icon={status === 'Chờ duyệt' ? <LoadingOutlined /> : status === 'Đã duyệt' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
          {status}
        </Tag>
      ),
      filters: [
        { text: 'Chờ duyệt', value: 'Chờ duyệt' },
        { text: 'Đã duyệt', value: 'Đã duyệt' },
        { text: 'Từ chối', value: 'Từ chối' },
      ],
      onFilter: (value: any, record: Applicant) => record.applicationStatus === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (text: string, record: Applicant) => (
        <Space size="middle">
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetails(record)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  // Hàm render file đính kèm
  const renderProofSection = (title: string, files: UploadFile[]) => (
    <>
      <Text strong>{title}:</Text>
      {files && files.length > 0 ? (
        <Upload
          fileList={files}
          showUploadList={{
            showRemoveIcon: false, // Không cho phép xóa từ đây
            showDownloadIcon: true,
            showPreviewIcon: true,
          }}
          itemRender={(originNode, file) => (
            <Space style={{ margin: '5px 0' }}>
              {originNode}
              {/* Nếu muốn xem ảnh/pdf trực tiếp, cần một component previewer hoặc mở tab mới */}
            </Space>
          )}
          listType="text" // Hoặc 'picture-card' nếu muốn hiển thị ảnh nhỏ
          // Cần một hàm customRequest nếu muốn hiển thị ảnh từ URL hoặc blob
        />
      ) : (
        <Text type="secondary">Chưa có minh chứng.</Text>
      )}
    </>
  );


  return (
    <div>
      <Title level={3}>Duyệt Minh chứng Hồ sơ Thí sinh</Title>

      <Space style={{ marginBottom: 16 }}>
        <Input
          prefix={<SearchOutlined />}
          placeholder="Tìm kiếm theo tên, mã SV, CCCD..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Lọc theo Trạng thái"
          style={{ width: 180 }}
          allowClear
          value={filterStatus}
          onChange={value => setFilterStatus(value)}
        >
          <Option value="Chờ duyệt">Chờ duyệt</Option>
          <Option value="Đã duyệt">Đã duyệt</Option>
          <Option value="Từ chối">Từ chối</Option>
        </Select>
      </Space>

      <Spin spinning={loading} tip="Đang tải danh sách hồ sơ...">
        <Table
          columns={columns}
          dataSource={filteredApplicants}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          bordered
          locale={{ emptyText: 'Không có hồ sơ nào cần duyệt.' }}
        />
      </Spin>

      {selectedApplicant && (
        <Modal
          title={`Chi tiết Hồ sơ: ${selectedApplicant.fullName}`}
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={
            <Space>
              <Button onClick={handleCancel}>Đóng</Button>
              {selectedApplicant.applicationStatus === 'Chờ duyệt' && (
                <>
                  <Button
                    type="primary"
                    icon={<CheckCircleOutlined />}
                    onClick={() => handleUpdateStatus('Đã duyệt')}
                    loading={loading}
                  >
                    Duyệt Hồ sơ
                  </Button>
                  <Popconfirm
                    title="Bạn có chắc chắn muốn từ chối hồ sơ này?"
                    description={
                      <Form form={form} layout="vertical" name="rejection_reason_form">
                        <Form.Item
                          name="rejectionReason"
                          label="Lý do từ chối"
                          rules={[{ required: true, message: 'Vui lòng nhập lý do từ chối!' }]}
                        >
                          <TextArea rows={3} placeholder="Ví dụ: Minh chứng học bạ không rõ ràng, thiếu giấy tờ ưu tiên..." />
                        </Form.Item>
                      </Form>
                    }
                    onConfirm={() => handleUpdateStatus('Từ chối')}
                    okText="Xác nhận Từ chối"
                    cancelText="Hủy"
                    placement="topRight"
                    overlayInnerStyle={{ width: 400 }} // Điều chỉnh độ rộng của Popconfirm
                    // Khi Popconfirm được mở, cần reset fields và set lại nếu có lý do cũ
                    onVisibleChange={(visible) => {
                      if (visible) {
                        form.resetFields();
                        if (selectedApplicant.rejectionReason) {
                          form.setFieldsValue({ rejectionReason: selectedApplicant.rejectionReason });
                        }
                      }
                    }}
                  >
                    <Button
                      type="default" // Đổi thành default để phân biệt
                      icon={<CloseCircleOutlined />}
                      danger
                      loading={loading}
                    >
                      Từ chối Hồ sơ
                    </Button>
                  </Popconfirm>
                </>
              )}
              {selectedApplicant.applicationStatus === 'Từ chối' && selectedApplicant.rejectionReason && (
                <Button icon={<MailOutlined />} onClick={() => message.info('Tính năng gửi lại email thông báo lý do từ chối.')}>
                  Gửi lại Email Lý do
                </Button>
              )}
               {selectedApplicant.applicationStatus === 'Đã duyệt' && (
                <Button icon={<MailOutlined />} onClick={() => message.info('Tính năng gửi lại email thông báo đã duyệt.')}>
                  Gửi lại Email Duyệt
                </Button>
              )}
            </Space>
          }
          width={800}
        >
          <Spin spinning={loading} tip="Đang cập nhật trạng thái...">
            <Descriptions bordered column={2} size="small">
              <Descriptions.Item label="Họ và tên">{selectedApplicant.fullName}</Descriptions.Item>
              <Descriptions.Item label="Mã SV">{selectedApplicant.studentId}</Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">{selectedApplicant.dob}</Descriptions.Item>
              <Descriptions.Item label="SĐT">{selectedApplicant.phone}</Descriptions.Item>
              <Descriptions.Item label="Email" span={2}>
                {selectedApplicant.email}
              </Descriptions.Item>
              <Descriptions.Item label="CCCD">{selectedApplicant.nationalId}</Descriptions.Item>
              <Descriptions.Item label="Ngành Đăng ký" span={2}>
                {selectedApplicant.majorRegistered}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày nộp hồ sơ">{selectedApplicant.submissionDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái hiện tại" span={1}>
                <Tag color={getStatusColor(selectedApplicant.applicationStatus)} icon={selectedApplicant.applicationStatus === 'Chờ duyệt' ? <LoadingOutlined /> : selectedApplicant.applicationStatus === 'Đã duyệt' ? <CheckCircleOutlined /> : <CloseCircleOutlined />}>
                  {selectedApplicant.applicationStatus}
                </Tag>
              </Descriptions.Item>
              {selectedApplicant.applicationStatus === 'Từ chối' && selectedApplicant.rejectionReason && (
                <Descriptions.Item label="Lý do từ chối" span={2}>
                  <Text type="danger">{selectedApplicant.rejectionReason}</Text>
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider orientation="left">Minh chứng đính kèm</Divider>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {renderProofSection('Minh chứng Thông tin cá nhân', selectedApplicant.proofs.personalInfoProof)}
              {renderProofSection('Minh chứng Điểm thi & Học bạ', selectedApplicant.proofs.scoreProof)}
              {renderProofSection('Minh chứng Ưu tiên', selectedApplicant.proofs.priorityProof)}
              {renderProofSection('Minh chứng Thành tích & Chứng chỉ', selectedApplicant.proofs.achievementProof)}
            </div>
          </Spin>
        </Modal>
      )}
    </div>
  );
};

export default ProofManagementPage;