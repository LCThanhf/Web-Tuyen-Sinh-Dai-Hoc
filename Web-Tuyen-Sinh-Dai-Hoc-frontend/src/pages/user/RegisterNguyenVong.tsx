
import { useState, useEffect } from "react";
import {
  Form,
  Select,
  Button,
  Typography,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import { applicationApi, type School, type Major, type AdmissionMethod } from "../../services/applicationApi";

const { Option } = Select;
const { Title } = Typography;

const RegisterNguyenVongForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // State for data
  const [schools, setSchools] = useState<School[]>([]);
  const [admissionMethods, setAdmissionMethods] = useState<AdmissionMethod[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  
  // State for selections
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedMajor, setSelectedMajor] = useState<Major | null>(null);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      try {
        const [schoolsData] = await Promise.all([
          applicationApi.getSchools(),
        ]);
        
        setSchools(schoolsData);
        
        // Extract unique admission methods from all schools
        const allMethods = schoolsData.flatMap(school => school.admissionMethods);
        const uniqueMethods = allMethods.filter((method, index, self) => 
          index === self.findIndex(m => m.id === method.id)
        );
        setAdmissionMethods(uniqueMethods);
        
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Không thể tải dữ liệu. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const onMethodChange = (methodId: string) => {
    setSelectedMethod(methodId);
    setSelectedSchool(null);
    setSelectedMajor(null);
    form.resetFields(["school", "major", "combination"]);
  };

  const onSchoolChange = async (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId);
    setSelectedSchool(school || null);
    setSelectedMajor(null);
    form.resetFields(["major", "combination"]);
    
    if (school) {
      try {
        const majorsData = await applicationApi.getMajors(school.id);
        setMajors(majorsData);
      } catch (error) {
        console.error('Error loading majors:', error);
        message.error('Không thể tải danh sách ngành. Vui lòng thử lại!');
      }
    }
  };

  const onMajorChange = (majorId: string) => {
    const major = majors.find(m => m.id === majorId);
    setSelectedMajor(major || null);
    form.resetFields(["combination"]);
  };

  const onFinish = async () => {
    if (!selectedSchool || !selectedMajor) {
      message.error('Vui lòng chọn trường và ngành!');
      return;
    }

    setSubmitting(true);
    try {
      const applicationData = {
        schoolId: selectedSchool.id,
        majorId: selectedMajor.id,
        priority: 1, // You might want to make this configurable
      };

      await applicationApi.submitApplication(applicationData);
      message.success("Gửi nguyện vọng thành công!");
      
      // Reset form
      form.resetFields();
      setSelectedMethod(null);
      setSelectedSchool(null);
      setSelectedMajor(null);
      setMajors([]);
      
    } catch (error: any) {
      console.error('Error submitting application:', error);
      const errorMessage = error?.response?.data?.message || 'Có lỗi xảy ra khi gửi nguyện vọng. Vui lòng thử lại!';
      message.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Filter schools based on selected admission method
  const getFilteredSchools = () => {
    if (!selectedMethod) return [];
    return schools.filter(school => 
      school.admissionMethods.some(method => method.id === selectedMethod)
    );
  };

  // Get combinations for selected major
  const getMajorCombinations = () => {
    if (!selectedMajor) return [];
    return selectedMajor.combinations?.map(mc => mc.combination) || [];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>Đang tải dữ liệu...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <Title level={3} style={{ textAlign: "center" }}>
        Đăng ký Nguyện vọng Xét tuyển
      </Title>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Phương thức xét tuyển"
              name="method"
              rules={[{ required: true, message: "Vui lòng chọn phương thức" }]}
            >
              <Select 
                placeholder="Chọn phương thức" 
                onChange={onMethodChange} 
                allowClear
                loading={loading}
              >
                {admissionMethods.map((method) => (
                  <Option key={method.id} value={method.id}>
                    {method.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Trường"
              name="school"
              rules={[{ required: true, message: "Vui lòng chọn trường" }]}
            >
              <Select
                placeholder="Chọn trường"
                disabled={!selectedMethod}
                onChange={onSchoolChange}
                allowClear
              >
                {getFilteredSchools().map((school) => (
                  <Option key={school.id} value={school.id}>
                    {school.name} ({school.code})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Ngành"
              name="major"
              rules={[{ required: true, message: "Vui lòng chọn ngành" }]}
            >
              <Select 
                placeholder="Chọn ngành" 
                disabled={!selectedSchool} 
                onChange={onMajorChange}
                allowClear
              >
                {majors.map((major) => (
                  <Option key={major.id} value={major.id}>
                    {major.name} ({major.code}) - Chỉ tiêu: {major.quota}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Tổ hợp xét tuyển"
              name="combination"
              rules={[{ required: true, message: "Vui lòng chọn tổ hợp xét tuyển" }]}
            >
              <Select 
                placeholder="Chọn tổ hợp xét tuyển" 
                disabled={!selectedMajor}
                allowClear
              >
                {getMajorCombinations().map((combination) => (
                  <Option key={combination.id} value={combination.id}>
                    {combination.name} ({combination.subjects.join(", ")})
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            disabled={!selectedMethod || !selectedSchool || !selectedMajor}
            loading={submitting}
          >
            {submitting ? 'Đang gửi...' : 'Gửi nguyện vọng'}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterNguyenVongForm;
