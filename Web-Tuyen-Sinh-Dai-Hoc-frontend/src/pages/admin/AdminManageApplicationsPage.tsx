import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  message,
  Select,
  Tag,
  Typography,
  Tooltip
} from 'antd';
import type { ColumnType } from 'antd/es/table';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { adminApi, type AdminApplication, type ApplicationFilter } from '../../services/adminApi';
import { applicationApi, type School, type Major, type AdmissionCombination } from '../../services/applicationApi';

const { Option } = Select;
const { Title } = Typography;

// Định nghĩa kiểu dữ liệu sử dụng từ backend API
interface StudentApplication {
  id: string;
  cccd: string;
  studentName: string;
  schoolId: string;
  majorId: string;
  combinationId?: string;
  admissionMethod: string;
  organizingUnit?: string;
  priorityOrder: number;
  submissionDate: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

// Transform AdminApplication to StudentApplication for table display
const transformAdminApplication = (adminApp: AdminApplication): StudentApplication => ({
  id: adminApp.id,
  cccd: adminApp.student.user.cccd,
  studentName: adminApp.student.user.fullName,
  schoolId: adminApp.schoolId,
  majorId: adminApp.majorId,
  combinationId: adminApp.combinationId,
  admissionMethod: adminApp.admissionMethod,
  organizingUnit: adminApp.organizingUnit,
  priorityOrder: adminApp.priorityOrder,
  submissionDate: adminApp.submissionDate,
  status: adminApp.status,
  adminNote: adminApp.adminNote,
  reviewedAt: adminApp.reviewedAt,
  reviewedBy: adminApp.reviewedBy,
});

const AdminManageApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<StudentApplication[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [combinations, setCombinations] = useState<AdmissionCombination[]>([]);

  // Debug log to track schools state changes
  useEffect(() => {
    console.log('🏫 Schools state updated:', schools);
    console.log('📊 Current schools count:', schools.length);
    if (schools.length > 0) {
      console.log('🎯 Schools list:', schools.map(s => `${s.name} (${s.code})`));
    }
  }, [schools]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingApplication, setEditingApplication] = useState<StudentApplication | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Filters
  const [filterSchoolId, setFilterSchoolId] = useState<string | undefined>(undefined);
  const [filterMajorId, setFilterMajorId] = useState<string | undefined>(undefined);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // States cho dropdown trong Modal (để thêm/sửa)
  const [modalSelectedSchoolId, setModalSelectedSchoolId] = useState<string | undefined>(undefined);
  const [modalSelectedMajorId, setModalSelectedMajorId] = useState<string | undefined>(undefined);
  const [modalFilteredMajors, setModalFilteredMajors] = useState<Major[]>([]);
  const [modalFilteredCombinations, setModalFilteredCombinations] = useState<AdmissionCombination[]>([]);

  // Load data from backend APIs
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        console.log('🔍 Starting to fetch initial data...');
        const [schoolsData, majorsData, combinationsData] = await Promise.all([
          applicationApi.getSchools(),
          applicationApi.getMajors(),
          applicationApi.getAdmissionCombinations(),
        ]);
        
        console.log('📚 Schools data received:', schoolsData);
        console.log('🎓 Number of schools:', schoolsData.length);
        console.log('🏢 School names:', schoolsData.map(s => `${s.name} (${s.code})`));
        
        setSchools(schoolsData);
        setMajors(majorsData);
        setCombinations(combinationsData);
        
        console.log('✅ State updated successfully');
      } catch (error) {
        console.error('❌ Error loading initial data:', error);
        message.error('Có lỗi khi tải dữ liệu cơ bản');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Load applications with filters
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const filters: ApplicationFilter = {
        page: currentPage,
        limit: pageSize,
        schoolId: filterSchoolId,
        majorId: filterMajorId,
      };

      const response = await adminApi.getApplications(filters);
      const transformedApplications = response.applications.map(transformAdminApplication);
      
      setApplications(transformedApplications);
      setTotal(response.pagination.total);
    } catch (error) {
      console.error('Error loading applications:', error);
      message.error('Có lỗi khi tải danh sách nguyện vọng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch applications when filters or pagination changes
  useEffect(() => {
    fetchApplications();
  }, [currentPage, pageSize, filterSchoolId, filterMajorId]);

  // Lọc ngành theo trường cho modal
  useEffect(() => {
    if (modalSelectedSchoolId) {
      setModalFilteredMajors(majors.filter(major => major.schoolId === modalSelectedSchoolId));
      if (editingApplication && editingApplication.schoolId === modalSelectedSchoolId) {
        form.setFieldsValue({ majorId: editingApplication.majorId });
        setModalSelectedMajorId(editingApplication.majorId);
      } else {
        form.setFieldsValue({ majorId: undefined, combinationId: undefined });
        setModalSelectedMajorId(undefined);
      }
    } else {
      setModalFilteredMajors([]);
      form.setFieldsValue({ majorId: undefined, combinationId: undefined });
      setModalSelectedMajorId(undefined);
    }
  }, [modalSelectedSchoolId, majors, editingApplication, form]);

  // Lọc tổ hợp theo ngành cho modal
  useEffect(() => {
    if (modalSelectedMajorId) {
      const fetchCombinations = async () => {
        try {
          const combinationsData = await applicationApi.getMajorCombinations(modalSelectedMajorId);
          setModalFilteredCombinations(combinationsData);
          
          if (editingApplication && editingApplication.majorId === modalSelectedMajorId) {
            form.setFieldsValue({ combinationId: editingApplication.combinationId });
          } else {
            form.setFieldsValue({ combinationId: undefined });
          }
        } catch (error) {
          console.error('Error loading combinations:', error);
        }
      };
      
      fetchCombinations();
    } else {
      setModalFilteredCombinations([]);
      form.setFieldsValue({ combinationId: undefined });
    }
  }, [modalSelectedMajorId, editingApplication, form]);

  // Hàm ánh xạ ID sang tên
  const getSchoolName = (id: string) => schools.find(s => s.id === id)?.name || 'N/A';
  const getMajorName = (id: string) => majors.find(m => m.id === id)?.name || 'N/A';
  const getCombinationName = (id: string) => combinations.find(c => c.id === id)?.name || 'N/A';

  // No client-side filtering - backend handles filtering via API
  const displayApplications = applications;

  // Handle application approval
  const handleApproveApplication = async (id: string) => {
    try {
      setLoading(true);
      await adminApi.approveApplication(id, { adminNote: 'Approved by admin' });
      message.success('Đã duyệt nguyện vọng thành công!');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error approving application:', error);
      message.error('Có lỗi khi duyệt nguyện vọng');
    } finally {
      setLoading(false);
    }
  };

  // Handle application rejection
  const handleRejectApplication = async (id: string) => {
    try {
      setLoading(true);
      await adminApi.rejectApplication(id, { adminNote: 'Rejected by admin' });
      message.success('Đã từ chối nguyện vọng!');
      fetchApplications(); // Refresh the list
    } catch (error) {
      console.error('Error rejecting application:', error);
      message.error('Có lỗi khi từ chối nguyện vọng');
    } finally {
      setLoading(false);
    }
  };

  // Mở modal sửa nguyện vọng
  const handleEditApplication = (record: StudentApplication) => {
    setEditingApplication(record);
    form.setFieldsValue(record);
    setModalSelectedSchoolId(record.schoolId);
    setModalSelectedMajorId(record.majorId);
    setIsModalVisible(true);
  };





  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Lọc ngành cho bộ lọc
  const currentFilteredMajors = useMemo(() => {
    return filterSchoolId ? majors.filter(major => major.schoolId === filterSchoolId) : majors;
  }, [filterSchoolId, majors]);

  // Remove unused interface
  const columns: ColumnType<StudentApplication>[] = [
    {
      title: 'Mã NV',
      dataIndex: 'id',
      key: 'id',
      sorter: (a: StudentApplication, b: StudentApplication) => a.id.localeCompare(b.id),
    },
    {
      title: 'CCCD',
      dataIndex: 'cccd',
      key: 'cccd',
      sorter: (a: StudentApplication, b: StudentApplication) => a.cccd.localeCompare(b.cccd),
    },
    {
      title: 'Họ và tên SV',
      dataIndex: 'studentName',
      key: 'studentName',
      sorter: (a: StudentApplication, b: StudentApplication) => a.studentName.localeCompare(b.studentName),
    },
    {
      title: 'Trường',
      dataIndex: 'schoolId',
      key: 'schoolName',
      render: (schoolId: string) => getSchoolName(schoolId),
      sorter: (a: StudentApplication, b: StudentApplication) => getSchoolName(a.schoolId).localeCompare(getSchoolName(b.schoolId)),
    },
    {
      title: 'Ngành',
      dataIndex: 'majorId',
      key: 'majorName',
      render: (majorId: string) => getMajorName(majorId),
    },
    {
      title: 'Tổ hợp / Đơn vị tổ chức',
      key: 'comboOrUnit',
      render: (_: any, record: StudentApplication) => {
        if (record.admissionMethod === 'Điểm THPT / Học bạ') {
          return getCombinationName(record.combinationId || '') || 'N/A';
        } else {
          return record.organizingUnit || 'N/A';
        }
      }
    },
    {
      title: 'Thứ tự NV',
      dataIndex: 'priorityOrder',
      key: 'priorityOrder',
      sorter: (a: StudentApplication, b: StudentApplication) => a.priorityOrder - b.priorityOrder,
      align: 'center' as const,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        const statusConfig = {
          'PENDING': { color: 'orange', text: 'Chờ duyệt' },
          'APPROVED': { color: 'green', text: 'Đã duyệt' },
          'REJECTED': { color: 'red', text: 'Từ chối' },
        };
        const config = statusConfig[status as keyof typeof statusConfig] || { color: 'gray', text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: StudentApplication) => (
        <Space size="middle">
          {record.status === 'PENDING' && (
            <>
              <Tooltip title="Duyệt nguyện vọng">
                <Button
                  icon={<CheckOutlined />}
                  onClick={() => handleApproveApplication(record.id)}
                  type="primary"
                  size="small"
                >
                  Duyệt
                </Button>
              </Tooltip>
              <Tooltip title="Từ chối nguyện vọng">
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => handleRejectApplication(record.id)}
                  danger
                  size="small"
                >
                  Từ chối
                </Button>
              </Tooltip>
            </>
          )}
          <Tooltip title="Xem chi tiết">
            <Button
              icon={<EyeOutlined />}
              onClick={() => handleEditApplication(record)}
              size="small"
            >
              Chi tiết
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý Nguyện vọng Đăng ký</Title>

      <Space style={{ marginBottom: 16 }}>
        <Select
          placeholder="Lọc theo Trường"
          style={{ width: 200 }}
          onChange={value => {
            setFilterSchoolId(value);
            setFilterMajorId(undefined);
          }}
          value={filterSchoolId}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {schools.map(school => (
            <Option key={school.id} value={school.id}>
              {school.name} ({school.code})
            </Option>
          ))}
        </Select>

        <Select
          placeholder="Lọc theo Ngành"
          style={{ width: 200 }}
          onChange={value => setFilterMajorId(value)}
          value={filterMajorId}
          disabled={!filterSchoolId && majors.length === 0}
          allowClear
          showSearch
          optionFilterProp="children"
          filterOption={(input, option) =>
            String(option?.children || '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {currentFilteredMajors.map(major => (
            <Option key={major.id} value={major.id}>
              {major.name} ({major.code})
            </Option>
          ))}
        </Select>
      </Space>

      <Table
        columns={columns}
        dataSource={displayApplications}
        rowKey="id"
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nguyện vọng`,
          onChange: (page, size) => {
            setCurrentPage(page);
            if (size !== pageSize) {
              setPageSize(size);
            }
          }
        }}
        bordered
        loading={loading}
        locale={{ emptyText: 'Không có nguyện vọng nào phù hợp.' }}
      />

      {/* Bỏ modal thêm vì không có quyền thêm, chỉ có sửa */}
      <Modal
        title="Chi tiết Nguyện vọng"
        visible={isModalVisible}
        onOk={handleCancel}
        onCancel={handleCancel}
        okText="Đóng"
        cancelButtonProps={{ style: { display: 'none' } }}
        confirmLoading={loading}
      >
        <Form
          form={form}
          layout="vertical"
          name="application_form"
          initialValues={editingApplication || {}}
        >
          <Form.Item
            name="cccd"
            label="CCCD"
          >
            <Input disabled placeholder="CCCD của thí sinh" />
          </Form.Item>
          <Form.Item
            name="studentName"
            label="Họ và tên Sinh viên"
          >
            <Input disabled placeholder="Tên của thí sinh" />
          </Form.Item>

          <Form.Item
            name="schoolId"
            label="Trường"
          >
            <Select
              disabled
              placeholder="Chọn trường"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {schools.map(school => (
                <Option key={school.id} value={school.id}>
                  {school.name} ({school.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="majorId"
            label="Ngành"
          >
            <Select
              disabled
              placeholder="Chọn ngành"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                String(option?.children || '').toLowerCase().includes(input.toLowerCase())
              }
            >
              {modalFilteredMajors.map(major => (
                <Option key={major.id} value={major.id}>
                  {major.name} ({major.code})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="admissionMethod"
            label="Phương thức xét tuyển"
          >
            <Select
              disabled
              placeholder="Chọn phương thức xét tuyển"
            >
              <Option value="Điểm THPT / Học bạ">Điểm THPT / Học bạ</Option>
              <Option value="Đánh giá năng lực / Tư duy">Đánh giá năng lực / Tư duy</Option>
            </Select>
          </Form.Item>

          {/* Nếu chọn phương thức Điểm THPT / Học bạ thì hiện chọn tổ hợp */}
          {form.getFieldValue('admissionMethod') === 'Điểm THPT / Học bạ' && (
            <Form.Item
              name="combinationId"
              label="Tổ hợp xét tuyển"
            >
              <Select
                disabled
                placeholder="Chọn tổ hợp"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  String(option?.children || '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {modalFilteredCombinations.map(combo => (
                  <Option key={combo.id} value={combo.id}>
                    {combo.name} ({combo.subjects.join(', ')})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Nếu chọn phương thức Đánh giá năng lực / Tư duy thì hiện nhập đơn vị tổ chức */}
          {form.getFieldValue('admissionMethod') === 'Đánh giá năng lực / Tư duy' && (
            <Form.Item
              name="organizingUnit"
              label="Đơn vị tổ chức"
            >
              <Input disabled placeholder="Nhập đơn vị tổ chức" />
            </Form.Item>
          )}

          <Form.Item
            name="priorityOrder"
            label="Thứ tự Nguyện vọng"
          >
            <Input disabled type="number" min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminManageApplicationsPage;
