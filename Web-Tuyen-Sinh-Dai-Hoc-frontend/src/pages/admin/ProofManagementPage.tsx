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
import FilePreviewModal from '../../components/FilePreviewModal';

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
  
  // File preview modal state
  const [filePreviewVisible, setFilePreviewVisible] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<string>('');
  const [previewFileName, setPreviewFileName] = useState<string>('');

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
      console.log('Fetching documents for tab:', currentTab);
      
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
      console.log('Fetched documents:', response);
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
      console.log('Approving document:', { id, adminNote, currentTab });
      
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
    } catch (error: any) {
      console.error('Error approving document:', error);
      // Log more detailed error information
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
      }
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
        } catch (error: any) {
          console.error('Error rejecting document:', error);
          // Log more detailed error information
          if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
          }
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

  // View file function
  const handleViewFile = (fileUrl?: string, fileName?: string) => {
    if (fileUrl) {
      setPreviewFileUrl(fileUrl);
      setPreviewFileName(fileName || 'file');
      setFilePreviewVisible(true);
    } else {
      message.warning("Không có file minh chứng để xem.");
    }
  };

  // Get columns for table based on document type
  const getColumns = (): any[] => {
    const baseColumns: any[] = [
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
    if (currentTab === 'personal') {
      baseColumns.splice(4, 0, {
        title: 'CCCD mặt trước',
        dataIndex: 'cccdFrontFile',
        key: 'cccdFrontFile',
        render: (fileUrl: string, record: any) =>
          fileUrl ? (
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewFile(fileUrl, `cccd_front_${record.student?.user?.fullName || 'cccd_front'}`)}
              size="small"
            >
              Xem file
            </Button>
          ) : (
            <Text type="secondary">Không có file</Text>
          ),
      });
      
      baseColumns.splice(5, 0, {
        title: 'CCCD mặt sau',
        dataIndex: 'cccdBackFile',
        key: 'cccdBackFile',
        render: (fileUrl: string, record: any) =>
          fileUrl ? (
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewFile(fileUrl, `cccd_back_${record.student?.user?.fullName || 'cccd_back'}`)}
              size="small"
            >
              Xem file
            </Button>
          ) : (
            <Text type="secondary">Không có file</Text>
          ),
      });
    }

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
      
      baseColumns.splice(5, 0, {
        title: 'Chi tiết điểm',
        key: 'scoreDetails',
        render: (_: any, record: any) => {
          if (record.type === 'ASSESSMENT') {
            if (record.noScoreDeclared) {
              return <Text type="secondary">Không có điểm</Text>;
            }
            return (
              <div>
                {record.assessmentType && <div><Text strong>{record.assessmentType}</Text></div>}
                {record.assessmentScore && <div>Điểm: {record.assessmentScore}</div>}
                {record.assessmentUnit && (
                  <div>
                    <Text type="secondary">
                      {(() => {
                        const unitMap: { [key: string]: string } = {
                          'DHQGHN': 'ĐH QG HN',
                          'DHQGTPHCM': 'ĐH QG TP.HCM',
                          'DHBK': 'ĐH Bách Khoa HN'
                        };
                        return unitMap[record.assessmentUnit] || record.assessmentUnit;
                      })()}
                    </Text>
                  </div>
                )}
              </div>
            );
          } else if (record.type === 'THPT') {
            const scores = record.scores || {};
            const scoreList = Object.entries(scores).map(([subject, score]) => `${subject}: ${score}`);
            return scoreList.length > 0 ? scoreList.join(', ') : 'Không có điểm';
          } else if (record.type === 'TRANSCRIPT') {
            return record.averageOverall ? `TB tổng: ${record.averageOverall}` : 'Không có điểm TB';
          }
          return 'N/A';
        },
      });
    }

    if (currentTab === 'priority') {
      baseColumns.splice(4, 0, {
        title: 'Khu vực/Đối tượng',
        key: 'priorityInfo',
        render: (_: any, record: any) => (
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
        dataIndex: 'type',
        key: 'type',
        render: (type: string) => {
          const typeMap: { [key: string]: string } = {
            'tinh': 'HSG cấp tỉnh/TP',
            'quocGia': 'HSG cấp Quốc gia',
            'none': 'Không có thành tích'
          };
          return typeMap[type] || type || 'N/A';
        },
      });
      
      baseColumns.splice(5, 0, {
        title: 'File minh chứng',
        dataIndex: 'file',
        key: 'file',
        render: (fileUrl: string, record: any) =>
          fileUrl ? (
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewFile(fileUrl, `thành_tích_${record.student?.user?.fullName || 'hsg'}`)}
              size="small"
            >
              Xem file
            </Button>
          ) : (
            <Text type="secondary">Không có file</Text>
          ),
      });
    }

    if (currentTab === 'certificate') {
      baseColumns.splice(4, 0, {
        title: 'Loại chứng chỉ',
        dataIndex: 'type',
        key: 'type',
        render: (type: string) => {
          if (type === 'None') return 'Không có chứng chỉ';
          return type || 'N/A';
        },
      });
      
      baseColumns.splice(5, 0, {
        title: 'File minh chứng',
        dataIndex: 'file',
        key: 'file',
        render: (fileUrl: string, record: any) =>
          fileUrl ? (
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewFile(fileUrl, `chứng_chỉ_${record.student?.user?.fullName || 'certificate'}`)}
              size="small"
            >
              Xem file
            </Button>
          ) : (
            <Text type="secondary">Không có file</Text>
          ),
      });
    }

    // Add action column
    baseColumns.push({
      title: 'Thao tác',
      dataIndex: 'actions',
      key: 'actions',
      render: (_: any, record: any) => (
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
          
          {/* Personal information specific fields */}
          {currentTab === 'personal' && (
            <>
              {/* Personal Details Section */}
              <Col span={24}>
                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>Chi tiết thông tin cá nhân</Title>
              </Col>
              
              {/* Basic Information */}
              <Col span={12}>
                <Text strong>Ngày sinh: </Text>
                <Text>{selectedDocument.student?.dob ? new Date(selectedDocument.student.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Giới tính: </Text>
                <Text>{selectedDocument.student?.gender === 'MALE' ? 'Nam' : selectedDocument.student?.gender === 'FEMALE' ? 'Nữ' : 'Chưa cập nhật'}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Dân tộc: </Text>
                <Text>{selectedDocument.ethnicity || 'Chưa cập nhật'}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Tôn giáo: </Text>
                <Text>{selectedDocument.religion || 'Không'}</Text>
              </Col>
              
              {/* CCCD Information */}
              <Col span={24}>
                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>Thông tin CCCD</Title>
              </Col>
              <Col span={12}>
                <Text strong>Nơi cấp CCCD: </Text>
                <Text>{selectedDocument.student?.cccdIssuePlace || 'Chưa cập nhật'}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Ngày cấp CCCD: </Text>
                <Text>{selectedDocument.student?.cccdIssueDate ? new Date(selectedDocument.student.cccdIssueDate).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</Text>
              </Col>
              
              {/* Address Information */}
              <Col span={24}>
                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>Thông tin địa chỉ</Title>
              </Col>
              <Col span={24}>
                <Text strong>Địa chỉ thường trú: </Text>
                <Text>{selectedDocument.permanentAddress || 'Chưa cập nhật'}</Text>
              </Col>
              <Col span={24}>
                <Text strong>Địa chỉ hiện tại: </Text>
                <Text>{selectedDocument.currentAddress || 'Chưa cập nhật'}</Text>
              </Col>
              
              {/* Guardian Information */}
              <Col span={24}>
                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>Thông tin người giám hộ</Title>
              </Col>
              <Col span={12}>
                <Text strong>Họ tên người giám hộ: </Text>
                <Text>{selectedDocument.guardianName || 'Chưa cập nhật'}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Số điện thoại người giám hộ: </Text>
                <Text>{selectedDocument.guardianPhone || 'Chưa cập nhật'}</Text>
              </Col>
              <Col span={12}>
                <Text strong>Mối quan hệ: </Text>
                <Text>{selectedDocument.guardianRelation || 'Chưa cập nhật'}</Text>
              </Col>
              
              {/* CCCD Files */}
              <Col span={24}>
                <Title level={5} style={{ marginTop: 16, marginBottom: 12 }}>File minh chứng CCCD</Title>
              </Col>
              {selectedDocument.cccdFrontFile && (
                <Col span={12}>
                  <Text strong>CCCD mặt trước: </Text>
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewFile(selectedDocument.cccdFrontFile, `cccd_front_${selectedDocument.student?.user?.fullName || 'cccd_front'}`)}
                  >
                    Xem file CCCD mặt trước
                  </Button>
                </Col>
              )}
              {selectedDocument.cccdBackFile && (
                <Col span={12}>
                  <Text strong>CCCD mặt sau: </Text>
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewFile(selectedDocument.cccdBackFile, `cccd_back_${selectedDocument.student?.user?.fullName || 'cccd_back'}`)}
                  >
                    Xem file CCCD mặt sau
                  </Button>
                </Col>
              )}
              {!selectedDocument.cccdFrontFile && !selectedDocument.cccdBackFile && (
                <Col span={24}>
                  <Text type="secondary">Chưa có file CCCD được tải lên</Text>
                </Col>
              )}
            </>
          )}
          
          {/* Specific fields based on document type */}
          {currentTab === 'scores' && (
            <>
              <Col span={12}>
                <Text strong>Loại điểm: </Text>
                <Text>{(() => {
                  const typeMap: { [key: string]: string } = {
                    'THPT': 'Điểm thi THPT',
                    'TRANSCRIPT': 'Điểm học bạ',
                    'ASSESSMENT': 'Đánh giá năng lực/tư duy'
                  };
                  return typeMap[selectedDocument.type] || selectedDocument.type;
                })()}</Text>
              </Col>
              
              {selectedDocument.type === 'ASSESSMENT' ? (
                <>
                  {selectedDocument.assessmentType && (
                    <Col span={12}>
                      <Text strong>Loại đánh giá: </Text>
                      <Text>{selectedDocument.assessmentType}</Text>
                    </Col>
                  )}
                  {selectedDocument.assessmentUnit && (
                    <Col span={12}>
                      <Text strong>Đơn vị tổ chức: </Text>
                      <Text>{(() => {
                        const unitMap: { [key: string]: string } = {
                          'DHQGHN': 'ĐH Quốc gia Hà Nội',
                          'DHQGTPHCM': 'ĐH Quốc gia TP.HCM',
                          'DHBK': 'ĐH Bách Khoa Hà Nội'
                        };
                        return unitMap[selectedDocument.assessmentUnit] || selectedDocument.assessmentUnit;
                      })()}</Text>
                    </Col>
                  )}
                  {selectedDocument.assessmentScore && (
                    <Col span={12}>
                      <Text strong>Điểm số: </Text>
                      <Text>{selectedDocument.assessmentScore}</Text>
                    </Col>
                  )}
                  {selectedDocument.noScoreDeclared && (
                    <Col span={12}>
                      <Text strong>Khai báo không có điểm: </Text>
                      <Text>Có</Text>
                    </Col>
                  )}
                </>
              ) : (
                selectedDocument.scores && Object.keys(selectedDocument.scores).length > 0 && (
                  <Col span={24}>
                    <Text strong>Điểm số: </Text>
                    <pre style={{ background: '#f5f5f5', padding: 8, borderRadius: 4 }}>
                      {JSON.stringify(selectedDocument.scores, null, 2)}
                    </pre>
                  </Col>
                )
              )}
              
              {selectedDocument.examNumber && (
                <Col span={12}>
                  <Text strong>Số báo danh: </Text>
                  <Text>{selectedDocument.examNumber}</Text>
                </Col>
              )}
              {selectedDocument.examBan && (
                <Col span={12}>
                  <Text strong>Ban thi: </Text>
                  <Text>{(() => {
                    const banMap: { [key: string]: string } = {
                      'natural': 'Khoa học tự nhiên',
                      'social': 'Khoa học xã hội',
                      'general': 'Khối chung'
                    };
                    return banMap[selectedDocument.examBan] || selectedDocument.examBan;
                  })()}</Text>
                </Col>
              )}
              {selectedDocument.averageOverall && (
                <Col span={12}>
                  <Text strong>Điểm trung bình tổng: </Text>
                  <Text>{selectedDocument.averageOverall}</Text>
                </Col>
              )}
            </>
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
                <Text>{(() => {
                  const typeMap: { [key: string]: string } = {
                    'tinh': 'HSG cấp tỉnh/TP',
                    'quocGia': 'HSG cấp Quốc gia',
                    'none': 'Không có thành tích'
                  };
                  return typeMap[selectedDocument.type] || selectedDocument.type;
                })()}</Text>
              </Col>
              {selectedDocument.subject && (
                <Col span={12}>
                  <Text strong>Môn đạt giải: </Text>
                  <Text>{selectedDocument.subject}</Text>
                </Col>
              )}
              {selectedDocument.year && (
                <Col span={12}>
                  <Text strong>Năm đạt giải: </Text>
                  <Text>{selectedDocument.year}</Text>
                </Col>
              )}
              {selectedDocument.level && (
                <Col span={12}>
                  <Text strong>Loại giải: </Text>
                  <Text>{(() => {
                    const levelMap: { [key: string]: string } = {
                      'Nhat': 'Giải Nhất',
                      'Nhi': 'Giải Nhì',
                      'Ba': 'Giải Ba',
                      'KhuyenKhich': 'Giải Khuyến Khích'
                    };
                    return levelMap[selectedDocument.level] || selectedDocument.level;
                  })()}</Text>
                </Col>
              )}
              {selectedDocument.file && (
                <Col span={24}>
                  <Text strong>File minh chứng: </Text>
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewFile(selectedDocument.file, `thành_tích_${selectedDocument.student?.user?.fullName || 'hsg'}`)}
                  >
                    Xem file minh chứng
                  </Button>
                </Col>
              )}
            </>
          )}
          
          {currentTab === 'certificate' && (
            <>
              <Col span={12}>
                <Text strong>Loại chứng chỉ: </Text>
                <Text>{selectedDocument.type === 'None' ? 'Không có chứng chỉ' : selectedDocument.type}</Text>
              </Col>
              {selectedDocument.score && (
                <Col span={12}>
                  <Text strong>Điểm số: </Text>
                  <Text>{selectedDocument.score}</Text>
                </Col>
              )}
              {selectedDocument.issueDate && (
                <Col span={12}>
                  <Text strong>Ngày cấp: </Text>
                  <Text>{selectedDocument.issueDate}</Text>
                </Col>
              )}
              {selectedDocument.testCode && (
                <Col span={12}>
                  <Text strong>Mã dự thi: </Text>
                  <Text>{selectedDocument.testCode}</Text>
                </Col>
              )}
              {(selectedDocument.issuer || selectedDocument.issuerOther) && (
                <Col span={12}>
                  <Text strong>Đơn vị cấp: </Text>
                  <Text>{selectedDocument.issuer === 'Other' ? selectedDocument.issuerOther : selectedDocument.issuer}</Text>
                </Col>
              )}
              {selectedDocument.file && (
                <Col span={24}>
                  <Text strong>File minh chứng: </Text>
                  <Button 
                    type="link" 
                    icon={<EyeOutlined />} 
                    onClick={() => handleViewFile(selectedDocument.file, `chứng_chỉ_${selectedDocument.student?.user?.fullName || 'certificate'}`)}
                  >
                    Xem file chứng chỉ
                  </Button>
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

      {/* File Preview Modal */}
      <FilePreviewModal
        visible={filePreviewVisible}
        onClose={() => setFilePreviewVisible(false)}
        fileUrl={previewFileUrl}
        fileName={previewFileName}
        title="Xem file minh chứng"
      />
    </div>
  );
};

export default ProofManagementPage;

