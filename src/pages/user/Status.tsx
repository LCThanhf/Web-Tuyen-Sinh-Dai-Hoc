import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  InputNumber,
  Select,
  Form,
  Row,
  Col,
  Space,
  message,
  Typography,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  SaveOutlined,
} from "@ant-design/icons";

const { Option } = Select;
const { Title } = Typography;

// Tuỳ chọn form
const methods = ["Điểm THPT", "Học bạ", "Đánh giá năng lực/Đánh giá tư duy"];
const assessmentUnits = [
  "Đại học Quốc gia Hà Nội",
  "Đại học Quốc gia TP.HCM",
  "Đại học Bách khoa Hà Nội",
];
const subjectCombos = ["Toán, Lý, Hóa", "Toán, Lý, Anh", "Toán, Văn, Anh"];
const schoolsByMethod: Record<string, { code: string; name: string }[]> = {
  "Điểm THPT": [
    { code: "BK", name: "Đại học Bách Khoa" },
    { code: "KT", name: "Đại học Kinh Tế" },
  ],
  "Học bạ": [
    { code: "BK", name: "Đại học Bách Khoa" },
    { code: "KT", name: "Đại học Kinh Tế" },
  ],
  "Đánh giá năng lực/Đánh giá tư duy": [
    { code: "BK", name: "Đại học Bách Khoa" },
    { code: "KT", name: "Đại học Kinh Tế" },
  ],
};
const majorsBySchool: Record<string, { code: string; name: string }[]> = {
  BK: [
    { code: "CNTT", name: "Công nghệ thông tin" },
    { code: "DTVT", name: "Điện tử viễn thông" },
  ],
  KT: [
    { code: "KTQT", name: "Kinh tế quốc tế" },
    { code: "QTKD", name: "Quản trị kinh doanh" },
  ],
};

// Định nghĩa HoSo
interface HoSo {
  key: string;
  stt: number;
  method: string;
  schoolCode: string;
  school: string;
  majorCode: string;
  major: string;
  combo?: string;
  unit?: string;
  calculatedScore: number;
}

// Form component
interface FormProps {
  initialValues?: any;
  onCancel: () => void;
  onSubmit: (values: any) => void;
}
const RegisterForm: React.FC<FormProps> = ({ initialValues, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);

  // Khi initialValues thay đổi, reset hoặc set giá trị
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setSelectedMethod(initialValues.method);
      setSelectedSchool(initialValues.schoolCode);
    } else {
      form.resetFields();
      setSelectedMethod(null);
      setSelectedSchool(null);
    }
  }, [initialValues, form]);

  const handleMethodChange = (value: string) => {
    setSelectedMethod(value);
    setSelectedSchool(null);
    form.setFieldsValue({ schoolCode: undefined, majorCode: undefined, unit: undefined, combo: undefined });
  };
  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
    form.setFieldsValue({ majorCode: undefined });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Phương thức xét tuyển" name="method" rules={[{ required: true }]}>
            <Select placeholder="Chọn phương thức" onChange={handleMethodChange} allowClear>
              {methods.map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ngành" name="majorCode" rules={[{ required: true }]}>
            <Select placeholder="Chọn ngành" disabled={!selectedSchool} allowClear>
              {selectedSchool && majorsBySchool[selectedSchool].map(m => <Option key={m.code} value={m.code}>{m.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Trường" name="schoolCode" rules={[{ required: true }]}>
            <Select placeholder="Chọn trường" onChange={handleSchoolChange} disabled={!selectedMethod} allowClear>
              {selectedMethod && schoolsByMethod[selectedMethod].map(s => <Option key={s.code} value={s.code}>{s.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          {(selectedMethod === "Điểm THPT" || selectedMethod === "Học bạ") && (
            <Form.Item label="Tổ hợp môn" name="combo" rules={[{ required: true }]}>
              <Select placeholder="Chọn tổ hợp môn">
                {subjectCombos.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Form.Item>
          )}
          {selectedMethod === "Đánh giá năng lực/Đánh giá tư duy" && (
            <Form.Item label="Đơn vị tổ chức" name="unit" rules={[{ required: true }]}>
              <Select placeholder="Chọn đơn vị tổ chức">
                {assessmentUnits.map(u => <Option key={u} value={u}>{u}</Option>)}
              </Select>
            </Form.Item>
          )}
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'right' }}>
        <Button onClick={onCancel} style={{ marginRight: 8 }}>Hủy</Button>
        <Button type="primary" htmlType="submit">Lưu</Button>
      </Form.Item>
    </Form>
  );
};

// Component chính Status
const Status: React.FC = () => {
  const [data, setData] = useState<HoSo[]>([]);
  const [searchText, setSearchText] = useState("");
  const [isReordering, setIsReordering] = useState(false);
  const [tempSttMap, setTempSttMap] = useState<Record<string, number>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'add'|'edit'>('add');
  const [editingRecord, setEditingRecord] = useState<HoSo|null>(null);

  // Khởi tạo dữ liệu mẫu
  useEffect(() => {
    if (!data.length) {
      setData([
        { key:'1', stt:1, method:'Điểm THPT', schoolCode:'BK', school:'Đại học Bách Khoa', majorCode:'CNTT', major:'Công nghệ thông tin', combo:'Toán, Lý, Hóa', calculatedScore:26.5 },
        { key:'2', stt:2, method:'Học bạ', schoolCode:'KT', school:'Đại học Kinh Tế', majorCode:'KTQT', major:'Kinh tế quốc tế', combo:'Toán, Văn, Anh', calculatedScore:28.0 },
        { key:'3', stt:3, method:'Đánh giá năng lực/Đánh giá tư duy', schoolCode:'BK', school:'Đại học Bách Khoa', majorCode:'DTVT', major:'Điện tử viễn thông', unit:'Đại học Quốc gia Hà Nội', calculatedScore:25.0 },
      ]);
    }
  }, [data]);

  // Cập nhật thứ tự tự động
  useEffect(() => {
    if (!isReordering) {
      setData(prev => prev
        .sort((a,b)=>a.stt-b.stt)
        .map((item,idx)=>({...item, stt:idx+1}))
      );
    }
  }, [data.length, isReordering]);

  // Reorder handlers
  const handleTempSttChange = (key:string, val:number) => {
    setTempSttMap(prev=>({...prev,[key]:val}));
  };
  const handleSaveReorder = () => {
    let newData = data.map(item=>({ ...item, stt: tempSttMap[item.key] ?? item.stt }));
    newData.sort((a,b)=>a.stt-b.stt);
    newData = newData.map((item,idx)=>({...item, stt:idx+1}));
    setData(newData);
    setTempSttMap({});
    setIsReordering(false);
    message.success('Đã lưu thứ tự nguyện vọng mới!');
  };

  // Mở modal add/edit và reset form
  const openAdd = () => { setModalMode('add'); setEditingRecord(null); setModalVisible(true); };
  const openEdit = (rec:HoSo) => { setModalMode('edit'); setEditingRecord(rec); setModalVisible(true); };

  // Xử lý submit form
  const handleFormSubmit = (vals:any) => {
    const { method, unit, schoolCode, majorCode, combo } = vals;
    const schoolObj = schoolsByMethod[method].find(s=>s.code===schoolCode)!;
    const majorObj = majorsBySchool[schoolCode].find(m=>m.code===majorCode)!;
    if (modalMode==='add') {
      const newRec:HoSo = {
        key: Date.now().toString(), stt: data.length+1,
        method, schoolCode, school:schoolObj.name,
        majorCode, major:majorObj.name,
        combo, unit, calculatedScore: 0 // Set default value
      };
      setData(prev=>[...prev,newRec]); message.success('Thêm thành công!');
    } else if (modalMode==='edit' && editingRecord) {
      setData(prev=>prev.map(i=> i.key===editingRecord.key
        ? {...i, method, schoolCode, school:schoolObj.name, majorCode, major:majorObj.name, combo, unit}
        : i
      )); message.success('Cập nhật thành công!');
    }
    setModalVisible(false);
  };

  // Xóa
  const handleDelete = (key:string) => { setData(prev=>prev.filter(i=>i.key!==key)); message.success('Đã xóa!'); };

  // Xuất CSV
  const handleExport = () => {
    const headers=['STT','Trường','Ngành','Phương thức','Tổ hợp môn','Đơn vị tổ chức','Điểm xét tuyển'];
    const rows = data.map(d=>[d.stt,d.school,d.major,d.method,d.combo||'-',d.unit||'-',d.calculatedScore]);
    const csv=[headers.join(','),...rows.map(r=>r.join(','))].join('\n');
    const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='nguyenvong.csv';document.body.appendChild(a);a.click();document.body.removeChild(a);
    message.success('Đã xuất CSV!');
  };

  const columns = [
    { title:'Thứ tự NV', dataIndex:'stt', key:'stt', width:100,
      render:(t:number,rec:HoSo)=>(isReordering
        ? <InputNumber min={1} max={data.length} defaultValue={rec.stt} onChange={v=>handleTempSttChange(rec.key,v!)} style={{width:60}} />
        : t
      )
    },
    { title:'Trường', dataIndex:'school', key:'school', width:180 },
    { title:'Ngành', dataIndex:'major', key:'major', width:180 },
    { title:'Phương thức', dataIndex:'method', key:'method', width:200 },
    { title:'Tổ hợp môn', dataIndex:'combo', key:'combo', width:150, render:(t:any)=>t||'-' },
    { title:'Đơn vị tổ chức', dataIndex:'unit', key:'unit', width:200, render:(t:any)=>t||'-' },
    { title:'Điểm xét tuyển', dataIndex:'calculatedScore', key:'calculatedScore', width:150 },
    {
      title:'Thao tác', key:'action', width:150,
      render:(_:any,rec:HoSo)=>(<Space>
        <Button icon={<EditOutlined />} onClick={()=>openEdit(rec)} disabled={isReordering}>Sửa</Button>
        <Button danger icon={<DeleteOutlined />} onClick={()=>handleDelete(rec.key)} disabled={isReordering}>Xóa</Button>
      </Space>)
    },
  ];

  return (
    <div style={{padding:20}}>
      <Title level={3} style={{textAlign:'center',marginBottom:30}}>Danh sách Nguyện vọng</Title>
      <Space style={{marginBottom:16,width:'100%'}} direction="vertical" size="middle">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm nguyện vọng</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>In danh sách</Button>
            {!isReordering ?
              <Button icon={<EditOutlined />} onClick={()=>setIsReordering(true)}>Chỉnh thứ tự</Button>
              : <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveReorder}>Lưu thứ tự</Button>
            }
          </Space>
          <Input.Search placeholder="Tìm (Trường, Ngành...)" onChange={e=>setSearchText(e.target.value)} allowClear style={{width:300}} />
        </div>
      </Space>
      <Table
        columns={columns}
        dataSource={data.filter(i=>
          i.school.toLowerCase().includes(searchText.toLowerCase())||
          i.major.toLowerCase().includes(searchText.toLowerCase())||
          i.method.toLowerCase().includes(searchText.toLowerCase())
        )}
        rowKey="key"
        pagination={{pageSize:10}}
        bordered
      />

      <Modal
        visible={modalVisible}
        title={modalMode==='add'?'Thêm nguyện vọng':'Chỉnh sửa nguyện vọng'}
        footer={null}
        onCancel={()=>setModalVisible(false)}
        destroyOnClose // Remount form mỗi lần mở
      >
        <RegisterForm
          key={modalMode + (editingRecord?.key||'')}
          initialValues={modalMode==='edit'?{
            method:editingRecord!.method,
            unit:editingRecord!.unit,
            schoolCode:editingRecord!.schoolCode,
            majorCode:editingRecord!.majorCode,
            combo:editingRecord!.combo,
          }:undefined}
          onCancel={()=>setModalVisible(false)}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
};

export default Status;