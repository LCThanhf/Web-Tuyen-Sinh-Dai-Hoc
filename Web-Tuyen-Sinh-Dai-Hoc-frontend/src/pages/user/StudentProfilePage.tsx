import React, { useState, useEffect } from 'react';
import { Button, Typography, Row, Col, Divider, Card, Tabs, Spin, Alert } from 'antd';
import { EditOutlined, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { authApi } from '../../services/authApi';
import { studentApi } from '../../services/studentApi';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// Define interface for comprehensive profile data
interface ProfileData {
  // Basic user info from auth API
  fullName: string;
  cccd: string;
  email: string;
  phone: string;
  
  // Student info
  dateOfBirth?: string;
  gender?: 'MALE' | 'FEMALE';
  cccdIssuePlace?: string;
  cccdIssueDate?: string;
  address?: string;
  city?: string;
  district?: string;
  highSchoolName?: string;
  graduationYear?: number;
  
  // Personal info additional data
  ethnicity?: string;
  religion?: string;
  permanentAddress?: string;
  currentAddress?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  personalInfoStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  
  // Priority info
  priorityArea?: string;
  priorityObject?: string;
  priorityStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  
  // Achievement info
  achievementType?: string;
  achievementSubject?: string;
  achievementYear?: number;
  achievementLevel?: string;
  achievementStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  
  // Certificate info
  certificateType?: string;
  certificateLevel?: string;
  certificateIssueDate?: string;
  certificateStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const StudentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  // Fetch comprehensive profile data from multiple endpoints
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch basic user info
        const authResponse = await authApi.getProfile();
        const user = authResponse.user;

        // Fetch detailed student info - use the new method that handles nested response
        const studentProfile = await studentApi.getStudentProfile();
        
        // Fetch priority info
        let priorityInfo = null;
        try {
          priorityInfo = await studentApi.getPriority();
        } catch (err) {
          console.log('Priority info not found or error:', err);
        }

        // Fetch achievement info
        let achievementInfo = null;
        try {
          achievementInfo = await studentApi.getAchievement();
        } catch (err) {
          console.log('Achievement info not found or error:', err);
        }

        // Fetch certificate info
        let certificateInfo = null;
        try {
          certificateInfo = await studentApi.getCertificate();
        } catch (err) {
          console.log('Certificate info not found or error:', err);
        }

        // Combine all data - handle the actual backend response structure
        const combinedData: ProfileData = {
          // Basic user info
          fullName: user.fullName || '',
          cccd: user.cccd || '',
          email: user.email || '',
          phone: user.phone || '',
          
          // Student basic info - access from student object in response
          dateOfBirth: studentProfile?.student?.dob || '',
          gender: studentProfile?.student?.gender || undefined,
          cccdIssuePlace: studentProfile?.student?.cccdIssuePlace || '',
          cccdIssueDate: studentProfile?.student?.cccdIssueDate || '',
          address: studentProfile?.student?.address || '',
          city: studentProfile?.student?.city || '',
          district: studentProfile?.student?.district || '',
          highSchoolName: studentProfile?.student?.highSchoolName || '',
          graduationYear: studentProfile?.student?.graduationYear || undefined,
          
          // Personal info additional data - access from personalInfo object in response
          ethnicity: studentProfile?.personalInfo?.ethnicity || '',
          religion: studentProfile?.personalInfo?.religion || '',
          permanentAddress: studentProfile?.personalInfo?.permanentAddress || '',
          currentAddress: studentProfile?.personalInfo?.currentAddress || '',
          guardianName: studentProfile?.personalInfo?.guardianName || '',
          guardianPhone: studentProfile?.personalInfo?.guardianPhone || '',
          guardianRelation: studentProfile?.personalInfo?.guardianRelation || '',
          personalInfoStatus: studentProfile?.personalInfo?.status || undefined,
          
          // Priority info
          priorityArea: priorityInfo?.priorityArea || '',
          priorityObject: priorityInfo?.priorityObject || '',
          priorityStatus: priorityInfo?.status || undefined,
          
          // Achievement info - fix property access
          achievementType: achievementInfo?.type || '',
          achievementSubject: achievementInfo?.name || '',
          achievementYear: achievementInfo?.year || undefined,
          achievementLevel: achievementInfo?.level || '',
          achievementStatus: achievementInfo?.status || undefined,
          
          // Certificate info - fix property access 
          certificateType: certificateInfo?.type || '',
          certificateLevel: certificateInfo?.level || '',
          certificateIssueDate: certificateInfo?.issueDate || '',
          certificateStatus: certificateInfo?.status || undefined,
        };

        setProfileData(combinedData);
        
      } catch (error: any) {
        console.error('Error fetching profile data:', error);
        setError('Không thể tải thông tin hồ sơ. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditClick = () => {
    navigate('/student/profile/edit');
  };

  const formatGender = (gender?: string) => {
    if (!gender) return 'Chưa cập nhật';
    return gender === 'MALE' ? 'Nam' : 'Nữ';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Chưa cập nhật';
    return dayjs(dateString).format('DD/MM/YYYY');
  };

  const formatStatus = (status?: string) => {
    if (!status) return 'Chưa có';
    switch (status) {
      case 'PENDING': return 'Đang chờ duyệt';
      case 'APPROVED': return 'Đã duyệt';
      case 'REJECTED': return 'Bị từ chối';
      default: return status;
    }
  };

  const getStatusColor = (status?: string): "secondary" | "success" | "warning" | "danger" | undefined => {
    switch (status) {
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'danger';
      case 'PENDING': return 'warning';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 36 }} spin />} 
          tip="Đang tải thông tin hồ sơ..."
          size="large" 
        />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={() => window.location.reload()}>
              Thử lại
            </Button>
          }
        />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
        <Alert
          message="Không tìm thấy thông tin hồ sơ"
          description="Vui lòng đăng ký thông tin cá nhân trước."
          type="info"
          showIcon
          action={
            <Button type="primary" onClick={() => navigate('/student/info-registration/personal')}>
              Đăng ký thông tin
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <Title level={3} style={{ margin: 0 }}>Thông tin cá nhân</Title>
          <Text>Bạn có thể xem thông tin cá nhân của mình tại đây.</Text>
        </div>
        <Button 
          type="primary" 
          icon={<EditOutlined />}
          onClick={() => navigate('/student/profile/edit')}
          size="large"
        >
          Chỉnh sửa hồ sơ
        </Button>
      </div>
      <Divider />

      <Tabs defaultActiveKey="view">
        <TabPane tab={<span><EyeOutlined /> Xem thông tin</span>} key="view">
          <Card title="Chi tiết thông tin cá nhân" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Họ và tên:</strong> {profileData.fullName || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Ngày sinh:</strong> {formatDate(profileData.dateOfBirth)}</p>
              </Col>
              <Col span={12}>
                <p><strong>Giới tính:</strong> {formatGender(profileData.gender)}</p>
              </Col>
              <Col span={12}>
                <p><strong>CCCD:</strong> {profileData.cccd || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Nơi cấp CCCD:</strong> {profileData.cccdIssuePlace || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Ngày cấp CCCD:</strong> {formatDate(profileData.cccdIssueDate)}</p>
              </Col>
              <Col span={12}>
                <p><strong>Email:</strong> {profileData.email || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Số điện thoại:</strong> {profileData.phone || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Dân tộc:</strong> {profileData.ethnicity || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Tôn giáo:</strong> {profileData.religion || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Tỉnh/Thành phố:</strong> {profileData.city || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Quận/Huyện:</strong> {profileData.district || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={24}>
                <p><strong>Địa chỉ thường trú:</strong> {profileData.permanentAddress || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={24}>
                <p><strong>Địa chỉ hiện tại:</strong> {profileData.currentAddress || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Tên người giám hộ:</strong> {profileData.guardianName || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>SĐT người giám hộ:</strong> {profileData.guardianPhone || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Mối quan hệ:</strong> {profileData.guardianRelation || 'Chưa cập nhật'}</p>
              </Col>
              {profileData.personalInfoStatus && (
                <Col span={12}>
                  <p><strong>Trạng thái hồ sơ:</strong> <Text type={getStatusColor(profileData.personalInfoStatus)}>{formatStatus(profileData.personalInfoStatus)}</Text></p>
                </Col>
              )}
            </Row>
          </Card>

          <Card title="Thông tin học vấn" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Trường THPT:</strong> {profileData.highSchoolName || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Năm tốt nghiệp:</strong> {profileData.graduationYear || 'Chưa cập nhật'}</p>
              </Col>
            </Row>
          </Card>

          <Card title="Thông tin ưu tiên" style={{ marginBottom: 20 }}>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>Khu vực ưu tiên:</strong> {profileData.priorityArea || 'Chưa cập nhật'}</p>
              </Col>
              <Col span={12}>
                <p><strong>Đối tượng ưu tiên:</strong> {profileData.priorityObject || 'Chưa cập nhật'}</p>
              </Col>
              {profileData.priorityStatus && (
                <Col span={12}>
                  <p><strong>Trạng thái ưu tiên:</strong> <Text type={getStatusColor(profileData.priorityStatus)}>{formatStatus(profileData.priorityStatus)}</Text></p>
                </Col>
              )}
            </Row>
          </Card>

          {(profileData.achievementType || profileData.certificateType) && (
            <Card title="Thành tích và chứng chỉ" style={{ marginBottom: 20 }}>
              <Row gutter={16}>
                {profileData.achievementType && (
                  <>
                    <Col span={12}>
                      <p><strong>Loại thành tích:</strong> {profileData.achievementType}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>Môn/Lĩnh vực:</strong> {profileData.achievementSubject || 'Chưa cập nhật'}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>Năm đạt được:</strong> {profileData.achievementYear || 'Chưa cập nhật'}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>Cấp độ:</strong> {profileData.achievementLevel || 'Chưa cập nhật'}</p>
                    </Col>
                    {profileData.achievementStatus && (
                      <Col span={12}>
                        <p><strong>Trạng thái thành tích:</strong> <Text type={getStatusColor(profileData.achievementStatus)}>{formatStatus(profileData.achievementStatus)}</Text></p>
                      </Col>
                    )}
                  </>
                )}
                {profileData.certificateType && (
                  <>
                    <Col span={12}>
                      <p><strong>Loại chứng chỉ:</strong> {profileData.certificateType}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>Cấp độ:</strong> {profileData.certificateLevel || 'Chưa cập nhật'}</p>
                    </Col>
                    <Col span={12}>
                      <p><strong>Ngày cấp:</strong> {formatDate(profileData.certificateIssueDate)}</p>
                    </Col>
                    {profileData.certificateStatus && (
                      <Col span={12}>
                        <p><strong>Trạng thái chứng chỉ:</strong> <Text type={getStatusColor(profileData.certificateStatus)}>{formatStatus(profileData.certificateStatus)}</Text></p>
                      </Col>
                    )}
                  </>
                )}
              </Row>
            </Card>
          )}

          <Button type="primary" icon={<EditOutlined />} size="large" onClick={handleEditClick}>
            Chỉnh sửa thông tin
          </Button>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default StudentProfilePage;