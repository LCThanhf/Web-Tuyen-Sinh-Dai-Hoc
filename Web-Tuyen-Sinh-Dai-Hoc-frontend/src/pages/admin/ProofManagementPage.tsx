import React, { useState, useEffect } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Tabs,
  Tag,
  Typography,
  Row,
  Col,
  message,
  Spin,
  Pagination,
  Select,
  Card,
  Empty,
} from "antd";
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { adminApi } from '../../services/adminApi';

const { TabPane } = Tabs;
const { Text, Title } = Typography;
const { confirm } = Modal;
const { Option } = Select;

type DocumentType = 'personal' | 'scores' | 'priority' | 'achievement' | 'certificate';

interface ProofManagementPageProps {}

const ProofManagementPage: React.FC<ProofManagementPageProps> = () => {
  // State management
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState<DocumentType>('personal');
  const [documents, setDocuments] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | undefined>('PENDING');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Status tag component
  const StatusTag: React.FC<{ status: string }> = ({ status }) => {
    const getColor = (status: string) => {
      switch (status) {
        case 'APPROVED': return 'success';
        case 'REJECTED': return 'error';
        case 'PENDING': return 'processing';
        default: return 'default';
      }
    };

    const getText = (status: string) => {
      switch (status) {
        case 'APPROVED': return 'Đã duyệt';
        case 'REJECTED': return 'Từ chối';
        case 'PENDING': return 'Chờ duyệt';
        default: return status;
      }
    };

    return <Tag color={getColor(status)}>{getText(status)}</Tag>;
  };

  // Fetch documents based on current tab and filters
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const filters = {
        page: currentPage,
        limit: pageSize,
        status: statusFilter,
      };

      let response;
      switch (currentTab) {
        case 'personal':
          response = await adminApi.getPersonalInfoDocuments(filters);
          break;
        case 'scores':
          response = await adminApi.getScoreDocuments(filters);
          break;
        case 'priority':
          response = await adminApi.getPriorityDocuments(filters);
          break;
        case 'achievement':
          response = await adminApi.getAchievementDocuments(filters);
          break;
        case 'certificate':
          response = await adminApi.getCertificateDocuments(filters);
          break;
        default:
          return;
      }

      setDocuments(response.documents);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Error fetching documents:', error);
      message.error('Không thể tải danh sách hồ sơ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Approve document
  const handleApprove = async (id: string, adminNote?: string) => {
    try {
      setLoading(true);
      
      switch (currentTab) {
        case 'personal':
          await adminApi.approvePersonalInfo(id, { adminNote });
          break;
        case 'scores':
          await adminApi.approveScores(id, { adminNote });
          break;
        case 'priority':
          await adminApi.approvePriority(id, { adminNote });
          break;
        case 'achievement':
          await adminApi.approveAchievement(id, { adminNote });
          break;
        case 'certificate':
          await adminApi.approveCertificate(id, { adminNote });
          break;
      }

      message.success('Đã duyệt hồ sơ thành công!');
      fetchDocuments();
      setModalVisible(false);
    } catch (error) {
      console.error('Error approving document:', error);
      message.error('Có lỗi khi duyệt hồ sơ. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  // Reject document with reason
  const handleReject = (id: string) => {
    let rejectReason = '';

    confirm({
      title: 'Từ chối hồ sơ',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn từ chối hồ sơ này không?</p>
          <Input.TextArea
            placeholder="Nhập lý do từ chối..."
            autoSize={{ minRows: 3, maxRows: 6 }}
            onChange={(e) => { rejectReason = e.target.value; }}
          />
        </div>
      ),
      onOk: async () => {
        if (!rejectReason.trim()) {
          message.error('Vui lòng nhập lý do từ chối!');
          return Promise.reject();
        }

        try {
          setLoading(true);
          
          switch (currentTab) {
            case 'personal':
              await adminApi.rejectPersonalInfo(id, { adminNote: rejectReason });
              break;
            case 'scores':
              await adminApi.rejectScores(id, { adminNote: rejectReason });
              break;
            case 'priority':
              await adminApi.rejectPriority(id, { adminNote: rejectReason });
              break;
            case 'achievement':
              await adminApi.rejectAchievement(id, { adminNote: rejectReason });
              break;
            case 'certificate':
              await adminApi.rejectCertificate(id, { adminNote: rejectReason });
              break;
          }

          message.success('Đã từ chối hồ sơ!');
          fetchDocuments();
        } catch (error) {
          console.error('Error rejecting document:', error);
          message.error('Có lỗi khi từ chối hồ sơ. Vui lòng thử lại!');
        } finally {
          setLoading(false);
        }
      },
      okText: 'Từ chối',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
    });
  };

  // View document details
  const viewDocument = (record: any) => {
    setSelectedDocument(record);
    setModalVisible(true);
  };

  // Get columns for table based on document type
  const getColumns = () => {
    const baseColumns = [
      {
        title: 'Họ tên thí sinh',
        dataIndex: ['student', 'user', 'fullName'],
        key: 'fullName',
        render: (text: string) => <strong>{text}</strong>,
      },
      {
        title: 'CCCD/CMND',
        dataIndex: ['student', 'user', 'cccd'],
        key: 'cccd',
      },
      {
        title: 'Email',
        dataIndex: ['student', 'user', 'email'],
        key: 'email',
      },
      {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => <StatusTag status={status} />,
      },
      {
        title: 'Ngày tạo',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: (date: string) => new Date(date).toLocaleString('vi-VN'),
      },
    ];

    // Add specific columns based on document type
    if (currentTab === 'scores') {
      baseColumns.splice(4, 0, {
        title: 'Loại điểm',
        dataIndex: 'type',
        key: 'type',
        render: (type: string) => {
          const typeMap: { [key: string]: string } = {
            'THPT': 'Điểm thi THPT',
            'TRANSCRIPT': 'Điểm học bạ',
            'ASSESSMENT': 'Đánh giá năng lực'
          };
          return typeMap[type] || type;
        },
      });
    }

    if (currentTab === 'priority') {
      baseColumns.splice(4, 0, {
        title: 'Khu vực/Đối tượng',
        key: 'priorityInfo',
        render: (text: any, record: any) => (
          <div>
            {record.priorityArea && <div>KV: {record.priorityArea}</div>}
            {record.priorityObject && <div>ĐT: {record.priorityObject}</div>}
          </div>
        ),
      });
    }

    if (currentTab === 'achievement') {
      baseColumns.splice(4, 0, {
        title: 'Loại thành tích',
        dataIndex: 'achievementType',
        key: 'achievementType',
        render: (achievementType: string) => achievementType || 'N/A',
      });
    }

    if (currentTab === 'certificate') {
      baseColumns.splice(4, 0, {
        title: 'Loại chứng chỉ',
        dataIndex: 'certificateType',
        key: 'certificateType',
        render: (certificateType: string) => certificateType || 'N/A',
      });
    }

    // Add action column
    baseColumns.push({
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      render: (_, record: any) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => viewDocument(record)}
          >
            Xem chi tiết
          </Button>
          {record.status === 'PENDING' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(record.id)}
              >
                Duyệt
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => handleReject(record.id)}
              >
                Từ chối
              </Button>
            </>
          )}
        </Space>
      ),
    });

    return baseColumns;
  };

  // Get tab title with count
  const getTabTitle = (type: DocumentType, label: string) => {
    const pendingCount = documents.filter(doc => doc.status === 'PENDING' && doc.type === type).length;
    return (
      <span>
        {label}
        {pendingCount > 0 && statusFilter === 'PENDING' && (
          <Tag color="processing" style={{ marginLeft: 8 }}>
            {pendingCount}
          </Tag>
        )}
      </span>
    );
  };

  // Render document details modal content
  const renderDocumentDetails = () => {
    if (!selectedDocument) return null;

    return (
      <div>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Text strong>Thí sinh: </Text>
            <Text>{selectedDocument.student.user.fullName}</Text>
          </Col>
          <Col span={12}>
            <Text strong>CCCD/CMND: </Text>
            <Text>{selectedDocument.student.user.cccd}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Email: </Text>
            <Text>{selectedDocument.student.user.email}</Text>
          </Col>
          <Col span={12}>
            <Text strong>Trạng thái: </Text>
            <StatusTag status={selectedDocument.status} />
          </Col>
          <Col span={12}>
            <Text strong>Ngày tạo: </Text>
            <Text>{new Date(selectedDocument.createdAt).toLocaleString('vi-VN')}</Text>
          </Col>
          {selectedDocument.reviewedAt && (
            <Col span={12}>
              <Text strong>Ngày duyệt: </Text>
              <Text>{new Date(selectedDocument.reviewedAt).toLocaleString('vi-VN')}</Text>
            </Col>
          )}
          {selectedDocument.adminNote && (
            <Col span={24}>
              <Text strong>Ghi chú admin: </Text>
              <Text type={selectedDocument.status === 'REJECTED' ? 'danger' : undefined}>
                {selectedDocument.adminNote}
              </Text>
            </Col>
          )}
          
          {/* Specific fields based on document type */}
          {currentTab === 'scores' && selectedDocument.scores && (
            <Col span={24}>
              <Text strong>Điểm số: </Text>
              <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                {JSON.stringify(selectedDocument.scores, null, 2)}
              </pre>
            </Col>
          )}
          
          {currentTab === 'priority' && (
            <>
              {selectedDocument.priorityArea && (
                <Col span={12}>
                  <Text strong>Khu vực ưu tiên: </Text>
                  <Text>{selectedDocument.priorityArea}</Text>
                </Col>
              )}
              {selectedDocument.priorityObject && (
                <Col span={12}>
                  <Text strong>Đối tượng ưu tiên: </Text>
                  <Text>{selectedDocument.priorityObject}</Text>
                </Col>
              )}
            </>
          )}
          
          {currentTab === 'achievement' && (
            <>
              <Col span={12}>
                <Text strong>Loại thành tích: </Text>
                <Text>{selectedDocument.achievementType}</Text>
              </Col>
              {selectedDocument.description && (
                <Col span={24}>
                  <Text strong>Mô tả: </Text>
                  <Text>{selectedDocument.description}</Text>
                </Col>
              )}
            </>
          )}
          
          {currentTab === 'certificate' && (
            <>
              <Col span={12}>
                <Text strong>Loại chứng chỉ: </Text>
                <Text>{selectedDocument.certificateType}</Text>
              </Col>
              {selectedDocument.issuingBody && (
                <Col span={12}>
                  <Text strong>Đơn vị cấp: </Text>
                  <Text>{selectedDocument.issuingBody}</Text>
                </Col>
              )}
            </>
          )}
        </Row>

        {/* Action buttons for pending documents */}
        {selectedDocument.status === 'PENDING' && (
          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => handleApprove(selectedDocument.id)}
                loading={loading}
              >
                Duyệt hồ sơ
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReject(selectedDocument.id)}
                loading={loading}
              >
                Từ chối hồ sơ
              </Button>
            </Space>
          </div>
        )}
      </div>
    );
  };

  // Effects
  useEffect(() => {
    fetchDocuments();
  }, [currentTab, currentPage, pageSize, statusFilter]);

  // Reset page when changing tabs or filters
  useEffect(() => {
    setCurrentPage(1);
  }, [currentTab, statusFilter]);

  return (
    <div>
      <Card>
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={12}>
            <Title level={2} style={{ margin: 0 }}>
              Quản lý xét duyệt hồ sơ
            </Title>
          </Col>
          <Col span={12} style={{ textAlign: 'right' }}>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchDocuments}
              loading={loading}
            >
              Làm mới
            </Button>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              placeholder="Tìm kiếm theo tên, CCCD, email..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Trạng thái"
              value={statusFilter}
              onChange={(value) => setStatusFilter(value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="PENDING">Chờ duyệt</Option>
              <Option value="APPROVED">Đã duyệt</Option>
              <Option value="REJECTED">Từ chối</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Số bản ghi"
              value={pageSize}
              onChange={(value) => setPageSize(value)}
              style={{ width: '100%' }}
            >
              <Option value={10}>10 / trang</Option>
              <Option value={20}>20 / trang</Option>
              <Option value={50}>50 / trang</Option>
            </Select>
          </Col>
        </Row>

        <Tabs 
          activeKey={currentTab} 
          onChange={(key) => setCurrentTab(key as DocumentType)}
          type="card"
        >
          <TabPane 
            tab={getTabTitle('personal', 'Thông tin cá nhân')} 
            key="personal"
          />
          <TabPane 
            tab={getTabTitle('scores', 'Điểm thi & học bạ')} 
            key="scores"
          />
          <TabPane 
            tab={getTabTitle('priority', 'Thông tin ưu tiên')} 
            key="priority"
          />
          <TabPane 
            tab={getTabTitle('achievement', 'Thành tích HSG')} 
            key="achievement"
          />
          <TabPane 
            tab={getTabTitle('certificate', 'Chứng chỉ')} 
            key="certificate"
          />
        </Tabs>

        <Spin spinning={loading}>
          {documents.length > 0 ? (
            <>
              <Table
                columns={getColumns()}
                dataSource={documents}
                rowKey="id"
                pagination={false}
                scroll={{ x: 1200 }}
              />
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={total}
                  showSizeChanger={false}
                  showQuickJumper
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} của ${total} hồ sơ`
                  }
                  onChange={(page) => setCurrentPage(page)}
                />
              </div>
            </>
          ) : (
            <Empty
              description="Không có hồ sơ nào"
              style={{ margin: '40px 0' }}
            />
          )}
        </Spin>
      </Card>

      {/* Document Details Modal */}
      <Modal
        title="Chi tiết hồ sơ"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        {renderDocumentDetails()}
      </Modal>
    </div>
  );
};

export default ProofManagementPage;

