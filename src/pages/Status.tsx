// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Descriptions,
//   Input,
//   Select,
//   Space,
//   Tag,
//   Typography,
//   Flex, // Import Flex for better alignment
//   message,
//   Popconfirm,
//   Tooltip, // For better UX on reordering buttons
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   DownloadOutlined,
//   UpOutlined,
//   DownOutlined,
// } from "@ant-design/icons";
// // import { useNavigate } from 'react-router-dom'; // Import useNavigate nếu bạn dùng react-router-dom

// const { Option } = Select;
// const { Title } = Typography;

// interface HoSo {
//   key: string;
//   stt: number; // Thêm trường số thứ tự
//   // cccd: string; // Bỏ CCCD và fullName theo yêu cầu
//   // fullName: string;
//   school: string;
//   major: string;
//   method: string;
//   combo?: string; // Tổ hợp môn (nếu có)
//   unit?: string; // Đơn vị tổ chức (nếu ĐGNL/ĐGTD)
//   score?: number; // Điểm thi ĐGNL/ĐGTD
//   totalScore?: number; // Tổng điểm tổ hợp THPT/Học bạ
//   calculatedScore?: number; // Điểm xét tuyển đã tính
//   status: string;
//   // fileUrl: string; // Bỏ fileUrl theo yêu cầu từ form trước
// }

// // Dữ liệu mẫu đã được cập nhật để phù hợp với yêu cầu mới
// const sampleHoSo: HoSo[] = [
//   {
//     key: "1",
//     stt: 1,
//     school: "Đại học Bách Khoa",
//     major: "Công nghệ thông tin",
//     method: "Điểm THPT",
//     combo: "Toán, Lý, Hóa",
//     totalScore: 26.5,
//     calculatedScore: 26.5, // Giả định điểm xét tuyển bằng tổng điểm
//     status: "Chờ duyệt",
//   },
//   {
//     key: "2",
//     stt: 2,
//     school: "Đại học Kinh Tế",
//     major: "Kinh tế quốc tế",
//     method: "Học bạ",
//     combo: "Toán, Văn, Anh",
//     totalScore: 28.0,
//     calculatedScore: 28.0,
//     status: "Đã duyệt",
//   },
//   {
//     key: "3",
//     stt: 3,
//     school: "Đại học Bách Khoa",
//     major: "Điện tử viễn thông",
//     method: "Đánh giá năng lực/Đánh giá tư duy",
//     unit: "Đại học Quốc gia Hà Nội",
//     score: 1100,
//     calculatedScore: 25.0, // Giả định điểm xét tuyển đã được quy đổi
//     status: "Từ chối",
//   },
// ];

// const Status: React.FC = () => {
//   const [data, setData] = useState<HoSo[]>(sampleHoSo);
//   const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
//   const [searchText, setSearchText] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState<HoSo | null>(null);
//   // const navigate = useNavigate(); // Khởi tạo useNavigate

//   // Cập nhật STT mỗi khi data thay đổi
//   useEffect(() => {
//     setData((prevData) =>
//       prevData.map((item, index) => ({ ...item, stt: index + 1 }))
//     );
//   }, [data.length]); // Chỉ chạy khi số lượng item thay đổi

//   // Lọc dữ liệu
//   const filteredData = data.filter(
//     (item) =>
//       (!filterStatus || item.status === filterStatus) &&
//       (item.school.toLowerCase().includes(searchText.toLowerCase()) ||
//         item.major.toLowerCase().includes(searchText.toLowerCase()) ||
//         item.method.toLowerCase().includes(searchText.toLowerCase()))
//   );

//   // Xử lý di chuyển thứ tự nguyện vọng
//   const moveNguyenVong = (index: number, direction: "up" | "down") => {
//     if (direction === "up" && index > 0) {
//       const newData = [...data];
//       [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
//       setData(newData);
//       message.success("Đã di chuyển nguyện vọng lên!");
//     } else if (direction === "down" && index < data.length - 1) {
//       const newData = [...data];
//       [newData[index + 1], newData[index]] = [newData[index], newData[index + 1]];
//       setData(newData);
//       message.success("Đã di chuyển nguyện vọng xuống!");
//     }
//   };

//   // Xử lý xóa nguyện vọng
//   const handleDelete = (key: string) => {
//     setData((prevData) => prevData.filter((item) => item.key !== key));
//     message.success("Đã xóa nguyện vọng!");
//   };

//   // Xử lý "In danh sách" (Xuất Excel)
//   const handleExportExcel = () => {
//     // Logic xuất Excel ở đây
//     // Thường sẽ dùng thư viện như 'xlsx' hoặc tạo CSV thủ công
//     // Ví dụ đơn giản:
//     const headers = ["STT", "Trường", "Ngành", "Phương thức", "Tổ hợp môn/Đơn vị", "Điểm xét tuyển", "Trạng thái"];
//     const rows = data.map((item) => [
//       item.stt,
//       item.school,
//       item.major,
//       item.method + (item.unit ? ` (${item.unit})` : ''),
//       item.combo || "-",
//       item.calculatedScore || item.totalScore || item.score || "-",
//       item.status,
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...rows.map(e => e.join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     if (link.download !== undefined) { // feature detection
//       const url = URL.createObjectURL(blob);
//       link.setAttribute('href', url);
//       link.setAttribute('download', 'danh_sach_nguyen_vong.csv');
//       link.style.visibility = 'hidden';
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       message.success("Đã xuất danh sách nguyện vọng ra Excel (CSV)!");
//     } else {
//       message.error("Trình duyệt của bạn không hỗ trợ xuất file trực tiếp.");
//     }
//   };


//   const columns = [
//     {
//       title: "STT",
//       dataIndex: "stt",
//       key: "stt",
//       width: 60,
//     },
//     {
//       title: "Trường",
//       dataIndex: "school",
//       key: "school",
//       width: 150,
//     },
//     {
//       title: "Ngành",
//       dataIndex: "major",
//       key: "major",
//       width: 150,
//     },
//     {
//       title: "Phương thức xét tuyển",
//       dataIndex: "method",
//       key: "method",
//       width: 180,
//       render: (text: string, record: HoSo) => (
//         <>
//           {text}
//           {record.unit && <br /> && <small>({record.unit})</small>}
//         </>
//       ),
//     },
//     {
//       title: "Tổ hợp môn",
//       dataIndex: "combo",
//       key: "combo",
//       width: 120,
//       render: (text: string) => text || "-",
//     },
//     {
//       title: "Điểm xét tuyển",
//       dataIndex: "calculatedScore",
//       key: "calculatedScore",
//       width: 120,
//       render: (text: number, record: HoSo) => {
//         // Ưu tiên hiển thị calculatedScore, nếu không có thì hiển thị totalScore/score
//         if (text) return text;
//         if (record.totalScore) return record.totalScore;
//         if (record.score) return record.score;
//         return "-";
//       },
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       key: "status",
//       width: 100,
//       render: (status: string) => {
//         let color = "processing"; // Chờ duyệt
//         if (status === "Đã duyệt") {
//           color = "success";
//         } else if (status === "Từ chối") {
//           color = "error";
//         }
//         return <Tag color={color}>{status}</Tag>;
//       },
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       width: 150,
//       render: (_: any, record: HoSo, index: number) => (
//         <Space size="small">
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             // onClick={() => navigate(`/register-nguyen-vong?editKey=${record.key}`)}
//             onClick={() => {
//               message.info("Chức năng sửa sẽ chuyển hướng sang form đăng ký nguyện vọng. Vui lòng quay lại sau.");
//               // TODO: Điều hướng sang trang đăng ký nguyện vọng với key để chỉnh sửa
//             }}
//           >
//             Sửa
//           </Button>
//           <Popconfirm
//             title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
//             onConfirm={() => handleDelete(record.key)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button type="link" danger icon={<DeleteOutlined />}>
//               Xóa
//             </Button>
//           </Popconfirm>
//           <Tooltip title="Di chuyển lên">
//             <Button
//               icon={<UpOutlined />}
//               onClick={() => moveNguyenVong(index, "up")}
//               disabled={index === 0}
//             />
//           </Tooltip>
//           <Tooltip title="Di chuyển xuống">
//             <Button
//               icon={<DownOutlined />}
//               onClick={() => moveNguyenVong(index, "down")}
//               disabled={index === data.length - 1}
//             />
//           </Tooltip>
//         </Space>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
//         Danh sách Nguyện vọng Đã Đăng ký
//       </Title>

//       <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
//         <Space>
//           <Input.Search
//             placeholder="Tìm kiếm (Trường, Ngành, Phương thức)"
//             onChange={(e) => setSearchText(e.target.value)}
//             allowClear
//             style={{ width: 300 }}
//           />
//           <Select
//             placeholder="Lọc trạng thái"
//             allowClear
//             style={{ width: 180 }}
//             onChange={(value) => setFilterStatus(value)}
//           >
//             <Option value="Chờ duyệt">Chờ duyệt</Option>
//             <Option value="Đã duyệt">Đã duyệt</Option>
//             <Option value="Từ chối">Từ chối</Option>
//           </Select>
//         </Space>
//         <Space>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             // onClick={() => navigate('/register-nguyen-vong')}
//             onClick={() => message.info("Chuyển đến trang đăng ký nguyện vọng để thêm mới.")}
//           >
//             Thêm nguyện vọng mới
//           </Button>
//           <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
//             In danh sách (Xuất Excel)
//           </Button>
//           <Button type="primary" onClick={() => message.success("Đã lưu thứ tự nguyện vọng mới!")}>
//             Lưu thứ tự nguyện vọng
//           </Button>
//         </Space>
//       </Flex>

//       <Table
//         columns={columns}
//         dataSource={filteredData}
//         rowKey="key"
//         pagination={{ pageSize: 10 }}
//         bordered
//       />

//       <Modal
//         visible={modalVisible}
//         title="Chi tiết hồ sơ"
//         footer={null}
//         onCancel={() => setModalVisible(false)}
//         width={600}
//       >
//         {selectedRecord && (
//           <Descriptions bordered column={1} size="small">
//             <Descriptions.Item label="STT">{selectedRecord.stt}</Descriptions.Item>
//             <Descriptions.Item label="Trường">{selectedRecord.school}</Descriptions.Item>
//             <Descriptions.Item label="Ngành">{selectedRecord.major}</Descriptions.Item>
//             <Descriptions.Item label="Phương thức">{selectedRecord.method}</Descriptions.Item>
//             {selectedRecord.unit && (
//               <Descriptions.Item label="Đơn vị tổ chức">
//                 {selectedRecord.unit}
//               </Descriptions.Item>
//             )}
//             {selectedRecord.combo && (
//               <Descriptions.Item label="Tổ hợp môn">
//                 {selectedRecord.combo}
//               </Descriptions.Item>
//             )}
//             <Descriptions.Item label="Điểm xét tuyển">
//               {selectedRecord.calculatedScore || selectedRecord.totalScore || selectedRecord.score || "-"}
//             </Descriptions.Item>
//             <Descriptions.Item label="Trạng thái">
//               <Tag
//                 color={
//                   selectedRecord.status === "Đã duyệt"
//                     ? "success"
//                     : selectedRecord.status === "Từ chối"
//                     ? "error"
//                     : "processing"
//                 }
//               >
//                 {selectedRecord.status}
//               </Tag>
//             </Descriptions.Item>
//           </Descriptions>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default Status;







import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Descriptions,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  Flex,
  message,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  DownloadOutlined,
  SaveOutlined, // Sử dụng icon Save
} from "@ant-design/icons";
// import { useNavigate } from 'react-router-dom'; // Import useNavigate nếu bạn dùng react-router-dom

const { Option } = Select;
const { Title } = Typography;

interface HoSo {
  key: string;
  stt: number; // Số thứ tự hiện tại
  tempStt?: number; // Số thứ tự tạm thời để người dùng chỉnh sửa
  school: string;
  major: string;
  method: string;
  combo?: string;
  unit?: string;
  score?: number;
  totalScore?: number;
  calculatedScore?: number;
  // status: string; // Bỏ cột trạng thái
}

const sampleHoSo: HoSo[] = [
  {
    key: "1",
    stt: 1,
    school: "Đại học Bách Khoa",
    major: "Công nghệ thông tin",
    method: "Điểm THPT",
    combo: "Toán, Lý, Hóa",
    totalScore: 26.5,
    calculatedScore: 26.5,
  },
  {
    key: "2",
    stt: 2,
    school: "Đại học Kinh Tế",
    major: "Kinh tế quốc tế",
    method: "Học bạ",
    combo: "Toán, Văn, Anh",
    totalScore: 28.0,
    calculatedScore: 28.0,
  },
  {
    key: "3",
    stt: 3,
    school: "Đại học Bách Khoa",
    major: "Điện tử viễn thông",
    method: "Đánh giá năng lực/Đánh giá tư duy",
    unit: "Đại học Quốc gia Hà Nội",
    score: 1100,
    calculatedScore: 25.0,
  },
];

const Status: React.FC = () => {
  const [data, setData] = useState<HoSo[]>(sampleHoSo);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined); // Vẫn giữ filterStatus nếu muốn dùng cho mục đích khác sau này, nhưng hiện tại không dùng cho cột trạng thái
  const [searchText, setSearchText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<HoSo | null>(null);
  const [isReordering, setIsReordering] = useState(false); // Trạng thái để bật/tắt chế độ chỉnh sửa thứ tự

  // Cập nhật STT mỗi khi data thay đổi, chỉ khi không ở chế độ sắp xếp lại
  useEffect(() => {
    if (!isReordering) {
      setData((prevData) =>
        [...prevData]
          .sort((a, b) => a.stt - b.stt) // Đảm bảo luôn sort theo stt thực tế
          .map((item, index) => ({ ...item, stt: index + 1, tempStt: undefined })) // Xóa tempStt khi không reorder
      );
    }
  }, [data.length, isReordering]);

  // Lọc dữ liệu (bỏ lọc theo status)
  const filteredData = data.filter(
    (item) =>
      (item.school.toLowerCase().includes(searchText.toLowerCase()) ||
        item.major.toLowerCase().includes(searchText.toLowerCase()) ||
        item.method.toLowerCase().includes(searchText.toLowerCase()))
  );

  // Xử lý thay đổi STT tạm thời khi người dùng nhập
  const handleTempSttChange = (key: string, value: string) => {
    const newStt = parseInt(value);
    setData(prevData =>
      prevData.map(item =>
        item.key === key
          ? { ...item, tempStt: isNaN(newStt) ? undefined : newStt }
          : item
      )
    );
  };

  // Lưu thứ tự nguyện vọng mới
  const handleSaveReorder = () => {
    const newOrder = [...data];

    // Kiểm tra và gán lại STT dựa trên tempStt
    const sttMap = new Map<number, HoSo[]>();
    newOrder.forEach(item => {
        const sttToUse = item.tempStt !== undefined ? item.tempStt : item.stt;
        if (!sttMap.has(sttToUse)) {
            sttMap.set(sttToUse, []);
        }
        sttMap.get(sttToUse)?.push(item);
    });

    let hasDuplicateStt = false;
    let newSttCounter = 1;
    const finalOrderedData: HoSo[] = [];

    // Duyệt qua các STT từ nhỏ đến lớn
    for (let i = 1; i <= newOrder.length; i++) {
        if (sttMap.has(i)) {
            const itemsWithThisStt = sttMap.get(i);
            if (itemsWithThisStt && itemsWithThisStt.length > 1) {
                hasDuplicateStt = true;
                // Nếu có trùng STT, thêm vào theo thứ tự hiện tại, hoặc có thể thêm logic cảnh báo
                itemsWithThisStt.forEach(item => {
                    finalOrderedData.push({ ...item, stt: newSttCounter++ });
                });
            } else if (itemsWithThisStt) {
                finalOrderedData.push({ ...itemsWithThisStt[0], stt: newSttCounter++ });
            }
        }
    }

    // Xử lý các mục không được gán STT hợp lệ hoặc bị bỏ qua
    const itemsWithoutAssignedStt = newOrder.filter(item => !finalOrderedData.some(fItem => fItem.key === item.key));
    itemsWithoutAssignedStt.forEach(item => {
        finalOrderedData.push({ ...item, stt: newSttCounter++ });
    });

    finalOrderedData.sort((a, b) => a.stt - b.stt); // Đảm bảo thứ tự cuối cùng là đúng

    setData(finalOrderedData.map((item, index) => ({ ...item, stt: index + 1, tempStt: undefined }))); // Cập nhật lại STT chuẩn và xóa tempStt
    setIsReordering(false);
    message.success("Đã lưu thứ tự nguyện vọng mới!");
    if (hasDuplicateStt) {
        message.warning("Có một số nguyện vọng có cùng số thứ tự. Chúng đã được sắp xếp lại tự động.");
    }
  };

  // Xử lý xóa nguyện vọng
  const handleDelete = (key: string) => {
    setData((prevData) => prevData.filter((item) => item.key !== key));
    message.success("Đã xóa nguyện vọng!");
  };

  // Xử lý "In danh sách" (Xuất Excel)
  const handleExportExcel = () => {
    const headers = [
      "STT",
      "Trường",
      "Ngành",
      "Phương thức xét tuyển",
      "Tổ hợp môn",
      "Đơn vị tổ chức",
      "Điểm xét tuyển",
    ];
    const rows = data.map((item) => [
      item.stt,
      item.school,
      item.major,
      item.method,
      item.combo || "-",
      item.unit || "-",
      item.calculatedScore || item.totalScore || item.score || "-",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((e) => e.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "danh_sach_nguyen_vong.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success("Đã xuất danh sách nguyện vọng ra Excel (CSV)!");
    } else {
      message.error("Trình duyệt của bạn không hỗ trợ xuất file trực tiếp.");
    }
  };

  const columns = [
    {
      title: "Thứ tự NV",
      dataIndex: "stt",
      key: "stt",
      width: 100,
      render: (text: number, record: HoSo) =>
        isReordering ? (
          <Input
            value={record.tempStt !== undefined ? record.tempStt : text}
            onChange={(e) => handleTempSttChange(record.key, e.target.value)}
            style={{ width: 60, textAlign: 'center' }}
            type="number"
            min={1}
            max={data.length}
          />
        ) : (
          text
        ),
    },
    {
      title: "Trường",
      dataIndex: "school",
      key: "school",
      width: 180,
    },
    {
      title: "Ngành",
      dataIndex: "major",
      key: "major",
      width: 180,
    },
    {
      title: "Phương thức xét tuyển",
      dataIndex: "method",
      key: "method",
      width: 200,
      render: (text: string, record: HoSo) => (
        <>
          {text}
          {record.unit && <br /> && <small>({record.unit})</small>}
        </>
      ),
    },
    {
      title: "Tổ hợp môn",
      dataIndex: "combo",
      key: "combo",
      width: 120,
      render: (text: string) => text || "-",
    },
    {
      title: "Điểm xét tuyển",
      dataIndex: "calculatedScore",
      key: "calculatedScore",
      width: 120,
      render: (text: number, record: HoSo) => {
        if (text) return text;
        if (record.totalScore) return record.totalScore;
        if (record.score) return record.score;
        return "-";
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      render: (_: any, record: HoSo) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              message.info("Chức năng sửa sẽ chuyển hướng sang form đăng ký nguyện vọng. Vui lòng quay lại sau.");
              // TODO: Điều hướng sang trang đăng ký nguyện vọng với key để chỉnh sửa
            }}
            disabled={isReordering} // Vô hiệu hóa khi đang sắp xếp
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger icon={<DeleteOutlined />} disabled={isReordering}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
        Danh sách Nguyện vọng Đã Đăng ký
      </Title>

      <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm (Trường, Ngành, Phương thức)"
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ width: 300 }}
          />
          {/* Bỏ bộ lọc trạng thái */}
        </Space>
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => message.info("Chuyển đến trang đăng ký nguyện vọng để thêm mới.")}
          >
            Thêm nguyện vọng mới
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
            In danh sách (Xuất Excel)
          </Button>
          {!isReordering ? (
            <Button onClick={() => setIsReordering(true)}>
              Chỉnh sửa thứ tự nguyện vọng
            </Button>
          ) : (
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveReorder}>
              Lưu thứ tự nguyện vọng
            </Button>
          )}
        </Space>
      </Flex>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="key"
        pagination={{ pageSize: 10 }}
        bordered
      />

      <Modal
        visible={modalVisible}
        title="Chi tiết hồ sơ"
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={600}
      >
        {selectedRecord && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Thứ tự NV">{selectedRecord.stt}</Descriptions.Item>
            <Descriptions.Item label="Trường">{selectedRecord.school}</Descriptions.Item>
            <Descriptions.Item label="Ngành">{selectedRecord.major}</Descriptions.Item>
            <Descriptions.Item label="Phương thức">{selectedRecord.method}</Descriptions.Item>
            {selectedRecord.unit && (
              <Descriptions.Item label="Đơn vị tổ chức">
                {selectedRecord.unit}
              </Descriptions.Item>
            )}
            {selectedRecord.combo && (
              <Descriptions.Item label="Tổ hợp môn">
                {selectedRecord.combo}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Điểm xét tuyển">
              {selectedRecord.calculatedScore || selectedRecord.totalScore || selectedRecord.score || "-"}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default Status;