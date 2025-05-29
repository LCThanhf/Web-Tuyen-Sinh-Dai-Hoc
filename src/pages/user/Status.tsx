// // import React, { useState, useEffect } from "react";
// // import {
// //   Table,
// //   Button,
// //   Modal,
// //   Descriptions,
// //   Input,
// //   Select,
// //   Space,
// //   Tag,
// //   Typography,
// //   Flex, // Import Flex for better alignment
// //   message,
// //   Popconfirm,
// //   Tooltip, // For better UX on reordering buttons
// // } from "antd";
// // import {
// //   EditOutlined,
// //   DeleteOutlined,
// //   PlusOutlined,
// //   DownloadOutlined,
// //   UpOutlined,
// //   DownOutlined,
// // } from "@ant-design/icons";
// // // import { useNavigate } from 'react-router-dom'; // Import useNavigate nếu bạn dùng react-router-dom

// // const { Option } = Select;
// // const { Title } = Typography;

// // interface HoSo {
// //   key: string;
// //   stt: number; // Thêm trường số thứ tự
// //   // cccd: string; // Bỏ CCCD và fullName theo yêu cầu
// //   // fullName: string;
// //   school: string;
// //   major: string;
// //   method: string;
// //   combo?: string; // Tổ hợp môn (nếu có)
// //   unit?: string; // Đơn vị tổ chức (nếu ĐGNL/ĐGTD)
// //   score?: number; // Điểm thi ĐGNL/ĐGTD
// //   totalScore?: number; // Tổng điểm tổ hợp THPT/Học bạ
// //   calculatedScore?: number; // Điểm xét tuyển đã tính
// //   status: string;
// //   // fileUrl: string; // Bỏ fileUrl theo yêu cầu từ form trước
// // }

// // // Dữ liệu mẫu đã được cập nhật để phù hợp với yêu cầu mới
// // const sampleHoSo: HoSo[] = [
// //   {
// //     key: "1",
// //     stt: 1,
// //     school: "Đại học Bách Khoa",
// //     major: "Công nghệ thông tin",
// //     method: "Điểm THPT",
// //     combo: "Toán, Lý, Hóa",
// //     totalScore: 26.5,
// //     calculatedScore: 26.5, // Giả định điểm xét tuyển bằng tổng điểm
// //     status: "Chờ duyệt",
// //   },
// //   {
// //     key: "2",
// //     stt: 2,
// //     school: "Đại học Kinh Tế",
// //     major: "Kinh tế quốc tế",
// //     method: "Học bạ",
// //     combo: "Toán, Văn, Anh",
// //     totalScore: 28.0,
// //     calculatedScore: 28.0,
// //     status: "Đã duyệt",
// //   },
// //   {
// //     key: "3",
// //     stt: 3,
// //     school: "Đại học Bách Khoa",
// //     major: "Điện tử viễn thông",
// //     method: "Đánh giá năng lực/Đánh giá tư duy",
// //     unit: "Đại học Quốc gia Hà Nội",
// //     score: 1100,
// //     calculatedScore: 25.0, // Giả định điểm xét tuyển đã được quy đổi
// //     status: "Từ chối",
// //   },
// // ];

// // const Status: React.FC = () => {
// //   const [data, setData] = useState<HoSo[]>(sampleHoSo);
// //   const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);
// //   const [searchText, setSearchText] = useState("");
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [selectedRecord, setSelectedRecord] = useState<HoSo | null>(null);
// //   // const navigate = useNavigate(); // Khởi tạo useNavigate

// //   // Cập nhật STT mỗi khi data thay đổi
// //   useEffect(() => {
// //     setData((prevData) =>
// //       prevData.map((item, index) => ({ ...item, stt: index + 1 }))
// //     );
// //   }, [data.length]); // Chỉ chạy khi số lượng item thay đổi

// //   // Lọc dữ liệu
// //   const filteredData = data.filter(
// //     (item) =>
// //       (!filterStatus || item.status === filterStatus) &&
// //       (item.school.toLowerCase().includes(searchText.toLowerCase()) ||
// //         item.major.toLowerCase().includes(searchText.toLowerCase()) ||
// //         item.method.toLowerCase().includes(searchText.toLowerCase()))
// //   );

// //   // Xử lý di chuyển thứ tự nguyện vọng
// //   const moveNguyenVong = (index: number, direction: "up" | "down") => {
// //     if (direction === "up" && index > 0) {
// //       const newData = [...data];
// //       [newData[index - 1], newData[index]] = [newData[index], newData[index - 1]];
// //       setData(newData);
// //       message.success("Đã di chuyển nguyện vọng lên!");
// //     } else if (direction === "down" && index < data.length - 1) {
// //       const newData = [...data];
// //       [newData[index + 1], newData[index]] = [newData[index], newData[index + 1]];
// //       setData(newData);
// //       message.success("Đã di chuyển nguyện vọng xuống!");
// //     }
// //   };

// //   // Xử lý xóa nguyện vọng
// //   const handleDelete = (key: string) => {
// //     setData((prevData) => prevData.filter((item) => item.key !== key));
// //     message.success("Đã xóa nguyện vọng!");
// //   };

// //   // Xử lý "In danh sách" (Xuất Excel)
// //   const handleExportExcel = () => {
// //     // Logic xuất Excel ở đây
// //     // Thường sẽ dùng thư viện như 'xlsx' hoặc tạo CSV thủ công
// //     // Ví dụ đơn giản:
// //     const headers = ["STT", "Trường", "Ngành", "Phương thức", "Tổ hợp môn/Đơn vị", "Điểm xét tuyển", "Trạng thái"];
// //     const rows = data.map((item) => [
// //       item.stt,
// //       item.school,
// //       item.major,
// //       item.method + (item.unit ? ` (${item.unit})` : ''),
// //       item.combo || "-",
// //       item.calculatedScore || item.totalScore || item.score || "-",
// //       item.status,
// //     ]);

// //     const csvContent = [
// //       headers.join(","),
// //       ...rows.map(e => e.join(",")),
// //     ].join("\n");

// //     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
// //     const link = document.createElement('a');
// //     if (link.download !== undefined) { // feature detection
// //       const url = URL.createObjectURL(blob);
// //       link.setAttribute('href', url);
// //       link.setAttribute('download', 'danh_sach_nguyen_vong.csv');
// //       link.style.visibility = 'hidden';
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
// //       message.success("Đã xuất danh sách nguyện vọng ra Excel (CSV)!");
// //     } else {
// //       message.error("Trình duyệt của bạn không hỗ trợ xuất file trực tiếp.");
// //     }
// //   };


// //   const columns = [
// //     {
// //       title: "STT",
// //       dataIndex: "stt",
// //       key: "stt",
// //       width: 60,
// //     },
// //     {
// //       title: "Trường",
// //       dataIndex: "school",
// //       key: "school",
// //       width: 150,
// //     },
// //     {
// //       title: "Ngành",
// //       dataIndex: "major",
// //       key: "major",
// //       width: 150,
// //     },
// //     {
// //       title: "Phương thức xét tuyển",
// //       dataIndex: "method",
// //       key: "method",
// //       width: 180,
// //       render: (text: string, record: HoSo) => (
// //         <>
// //           {text}
// //           {record.unit && <br /> && <small>({record.unit})</small>}
// //         </>
// //       ),
// //     },
// //     {
// //       title: "Tổ hợp môn",
// //       dataIndex: "combo",
// //       key: "combo",
// //       width: 120,
// //       render: (text: string) => text || "-",
// //     },
// //     {
// //       title: "Điểm xét tuyển",
// //       dataIndex: "calculatedScore",
// //       key: "calculatedScore",
// //       width: 120,
// //       render: (text: number, record: HoSo) => {
// //         // Ưu tiên hiển thị calculatedScore, nếu không có thì hiển thị totalScore/score
// //         if (text) return text;
// //         if (record.totalScore) return record.totalScore;
// //         if (record.score) return record.score;
// //         return "-";
// //       },
// //     },
// //     {
// //       title: "Trạng thái",
// //       dataIndex: "status",
// //       key: "status",
// //       width: 100,
// //       render: (status: string) => {
// //         let color = "processing"; // Chờ duyệt
// //         if (status === "Đã duyệt") {
// //           color = "success";
// //         } else if (status === "Từ chối") {
// //           color = "error";
// //         }
// //         return <Tag color={color}>{status}</Tag>;
// //       },
// //     },
// //     {
// //       title: "Thao tác",
// //       key: "action",
// //       width: 150,
// //       render: (_: any, record: HoSo, index: number) => (
// //         <Space size="small">
// //           <Button
// //             type="link"
// //             icon={<EditOutlined />}
// //             // onClick={() => navigate(`/register-nguyen-vong?editKey=${record.key}`)}
// //             onClick={() => {
// //               message.info("Chức năng sửa sẽ chuyển hướng sang form đăng ký nguyện vọng. Vui lòng quay lại sau.");
// //               // TODO: Điều hướng sang trang đăng ký nguyện vọng với key để chỉnh sửa
// //             }}
// //           >
// //             Sửa
// //           </Button>
// //           <Popconfirm
// //             title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
// //             onConfirm={() => handleDelete(record.key)}
// //             okText="Có"
// //             cancelText="Không"
// //           >
// //             <Button type="link" danger icon={<DeleteOutlined />}>
// //               Xóa
// //             </Button>
// //           </Popconfirm>
// //           <Tooltip title="Di chuyển lên">
// //             <Button
// //               icon={<UpOutlined />}
// //               onClick={() => moveNguyenVong(index, "up")}
// //               disabled={index === 0}
// //             />
// //           </Tooltip>
// //           <Tooltip title="Di chuyển xuống">
// //             <Button
// //               icon={<DownOutlined />}
// //               onClick={() => moveNguyenVong(index, "down")}
// //               disabled={index === data.length - 1}
// //             />
// //           </Tooltip>
// //         </Space>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div style={{ padding: 20 }}>
// //       <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
// //         Danh sách Nguyện vọng Đã Đăng ký
// //       </Title>

// //       <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
// //         <Space>
// //           <Input.Search
// //             placeholder="Tìm kiếm (Trường, Ngành, Phương thức)"
// //             onChange={(e) => setSearchText(e.target.value)}
// //             allowClear
// //             style={{ width: 300 }}
// //           />
// //           <Select
// //             placeholder="Lọc trạng thái"
// //             allowClear
// //             style={{ width: 180 }}
// //             onChange={(value) => setFilterStatus(value)}
// //           >
// //             <Option value="Chờ duyệt">Chờ duyệt</Option>
// //             <Option value="Đã duyệt">Đã duyệt</Option>
// //             <Option value="Từ chối">Từ chối</Option>
// //           </Select>
// //         </Space>
// //         <Space>
// //           <Button
// //             type="primary"
// //             icon={<PlusOutlined />}
// //             // onClick={() => navigate('/register-nguyen-vong')}
// //             onClick={() => message.info("Chuyển đến trang đăng ký nguyện vọng để thêm mới.")}
// //           >
// //             Thêm nguyện vọng mới
// //           </Button>
// //           <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
// //             In danh sách (Xuất Excel)
// //           </Button>
// //           <Button type="primary" onClick={() => message.success("Đã lưu thứ tự nguyện vọng mới!")}>
// //             Lưu thứ tự nguyện vọng
// //           </Button>
// //         </Space>
// //       </Flex>

// //       <Table
// //         columns={columns}
// //         dataSource={filteredData}
// //         rowKey="key"
// //         pagination={{ pageSize: 10 }}
// //         bordered
// //       />

// //       <Modal
// //         visible={modalVisible}
// //         title="Chi tiết hồ sơ"
// //         footer={null}
// //         onCancel={() => setModalVisible(false)}
// //         width={600}
// //       >
// //         {selectedRecord && (
// //           <Descriptions bordered column={1} size="small">
// //             <Descriptions.Item label="STT">{selectedRecord.stt}</Descriptions.Item>
// //             <Descriptions.Item label="Trường">{selectedRecord.school}</Descriptions.Item>
// //             <Descriptions.Item label="Ngành">{selectedRecord.major}</Descriptions.Item>
// //             <Descriptions.Item label="Phương thức">{selectedRecord.method}</Descriptions.Item>
// //             {selectedRecord.unit && (
// //               <Descriptions.Item label="Đơn vị tổ chức">
// //                 {selectedRecord.unit}
// //               </Descriptions.Item>
// //             )}
// //             {selectedRecord.combo && (
// //               <Descriptions.Item label="Tổ hợp môn">
// //                 {selectedRecord.combo}
// //               </Descriptions.Item>
// //             )}
// //             <Descriptions.Item label="Điểm xét tuyển">
// //               {selectedRecord.calculatedScore || selectedRecord.totalScore || selectedRecord.score || "-"}
// //             </Descriptions.Item>
// //             <Descriptions.Item label="Trạng thái">
// //               <Tag
// //                 color={
// //                   selectedRecord.status === "Đã duyệt"
// //                     ? "success"
// //                     : selectedRecord.status === "Từ chối"
// //                     ? "error"
// //                     : "processing"
// //                 }
// //               >
// //                 {selectedRecord.status}
// //               </Tag>
// //             </Descriptions.Item>
// //           </Descriptions>
// //         )}
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default Status;







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
//   Flex,
//   message,
//   Popconfirm,
// } from "antd";
// import {
//   EditOutlined,
//   DeleteOutlined,
//   PlusOutlined,
//   DownloadOutlined,
//   SaveOutlined, // Sử dụng icon Save
// } from "@ant-design/icons";
// // import { useNavigate } from 'react-router-dom'; // Import useNavigate nếu bạn dùng react-router-dom

// const { Option } = Select;
// const { Title } = Typography;

// interface HoSo {
//   key: string;
//   stt: number; // Số thứ tự hiện tại
//   tempStt?: number; // Số thứ tự tạm thời để người dùng chỉnh sửa
//   school: string;
//   major: string;
//   method: string;
//   combo?: string;
//   unit?: string;
//   score?: number;
//   totalScore?: number;
//   calculatedScore?: number;
//   // status: string; // Bỏ cột trạng thái
// }

// const sampleHoSo: HoSo[] = [
//   {
//     key: "1",
//     stt: 1,
//     school: "Đại học Bách Khoa",
//     major: "Công nghệ thông tin",
//     method: "Điểm THPT",
//     combo: "Toán, Lý, Hóa",
//     totalScore: 26.5,
//     calculatedScore: 26.5,
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
//   },
//   {
//     key: "3",
//     stt: 3,
//     school: "Đại học Bách Khoa",
//     major: "Điện tử viễn thông",
//     method: "Đánh giá năng lực/Đánh giá tư duy",
//     unit: "Đại học Quốc gia Hà Nội",
//     score: 1100,
//     calculatedScore: 25.0,
//   },
// ];

// const Status: React.FC = () => {
//   const [data, setData] = useState<HoSo[]>(sampleHoSo);
//   const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined); // Vẫn giữ filterStatus nếu muốn dùng cho mục đích khác sau này, nhưng hiện tại không dùng cho cột trạng thái
//   const [searchText, setSearchText] = useState("");
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedRecord, setSelectedRecord] = useState<HoSo | null>(null);
//   const [isReordering, setIsReordering] = useState(false); // Trạng thái để bật/tắt chế độ chỉnh sửa thứ tự

//   // Cập nhật STT mỗi khi data thay đổi, chỉ khi không ở chế độ sắp xếp lại
//   useEffect(() => {
//     if (!isReordering) {
//       setData((prevData) =>
//         [...prevData]
//           .sort((a, b) => a.stt - b.stt) // Đảm bảo luôn sort theo stt thực tế
//           .map((item, index) => ({ ...item, stt: index + 1, tempStt: undefined })) // Xóa tempStt khi không reorder
//       );
//     }
//   }, [data.length, isReordering]);

//   // Lọc dữ liệu (bỏ lọc theo status)
//   const filteredData = data.filter(
//     (item) =>
//       (item.school.toLowerCase().includes(searchText.toLowerCase()) ||
//         item.major.toLowerCase().includes(searchText.toLowerCase()) ||
//         item.method.toLowerCase().includes(searchText.toLowerCase()))
//   );

//   // Xử lý thay đổi STT tạm thời khi người dùng nhập
//   const handleTempSttChange = (key: string, value: string) => {
//     const newStt = parseInt(value);
//     setData(prevData =>
//       prevData.map(item =>
//         item.key === key
//           ? { ...item, tempStt: isNaN(newStt) ? undefined : newStt }
//           : item
//       )
//     );
//   };

//   // Lưu thứ tự nguyện vọng mới
//   const handleSaveReorder = () => {
//     const newOrder = [...data];

//     // Kiểm tra và gán lại STT dựa trên tempStt
//     const sttMap = new Map<number, HoSo[]>();
//     newOrder.forEach(item => {
//         const sttToUse = item.tempStt !== undefined ? item.tempStt : item.stt;
//         if (!sttMap.has(sttToUse)) {
//             sttMap.set(sttToUse, []);
//         }
//         sttMap.get(sttToUse)?.push(item);
//     });

//     let hasDuplicateStt = false;
//     let newSttCounter = 1;
//     const finalOrderedData: HoSo[] = [];

//     // Duyệt qua các STT từ nhỏ đến lớn
//     for (let i = 1; i <= newOrder.length; i++) {
//         if (sttMap.has(i)) {
//             const itemsWithThisStt = sttMap.get(i);
//             if (itemsWithThisStt && itemsWithThisStt.length > 1) {
//                 hasDuplicateStt = true;
//                 // Nếu có trùng STT, thêm vào theo thứ tự hiện tại, hoặc có thể thêm logic cảnh báo
//                 itemsWithThisStt.forEach(item => {
//                     finalOrderedData.push({ ...item, stt: newSttCounter++ });
//                 });
//             } else if (itemsWithThisStt) {
//                 finalOrderedData.push({ ...itemsWithThisStt[0], stt: newSttCounter++ });
//             }
//         }
//     }

//     // Xử lý các mục không được gán STT hợp lệ hoặc bị bỏ qua
//     const itemsWithoutAssignedStt = newOrder.filter(item => !finalOrderedData.some(fItem => fItem.key === item.key));
//     itemsWithoutAssignedStt.forEach(item => {
//         finalOrderedData.push({ ...item, stt: newSttCounter++ });
//     });

//     finalOrderedData.sort((a, b) => a.stt - b.stt); // Đảm bảo thứ tự cuối cùng là đúng

//     setData(finalOrderedData.map((item, index) => ({ ...item, stt: index + 1, tempStt: undefined }))); // Cập nhật lại STT chuẩn và xóa tempStt
//     setIsReordering(false);
//     message.success("Đã lưu thứ tự nguyện vọng mới!");
//     if (hasDuplicateStt) {
//         message.warning("Có một số nguyện vọng có cùng số thứ tự. Chúng đã được sắp xếp lại tự động.");
//     }
//   };

//   // Xử lý xóa nguyện vọng
//   const handleDelete = (key: string) => {
//     setData((prevData) => prevData.filter((item) => item.key !== key));
//     message.success("Đã xóa nguyện vọng!");
//   };

//   // Xử lý "In danh sách" (Xuất Excel)
//   const handleExportExcel = () => {
//     const headers = [
//       "STT",
//       "Trường",
//       "Ngành",
//       "Phương thức xét tuyển",
//       "Tổ hợp môn",
//       "Đơn vị tổ chức",
//       "Điểm xét tuyển",
//     ];
//     const rows = data.map((item) => [
//       item.stt,
//       item.school,
//       item.major,
//       item.method,
//       item.combo || "-",
//       item.unit || "-",
//       item.calculatedScore || item.totalScore || item.score || "-",
//     ]);

//     const csvContent = [
//       headers.join(","),
//       ...rows.map((e) => e.join(",")),
//     ].join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const link = document.createElement("a");
//     if (link.download !== undefined) {
//       const url = URL.createObjectURL(blob);
//       link.setAttribute("href", url);
//       link.setAttribute("download", "danh_sach_nguyen_vong.csv");
//       link.style.visibility = "hidden";
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
//       title: "Thứ tự NV",
//       dataIndex: "stt",
//       key: "stt",
//       width: 100,
//       render: (text: number, record: HoSo) =>
//         isReordering ? (
//           <Input
//             value={record.tempStt !== undefined ? record.tempStt : text}
//             onChange={(e) => handleTempSttChange(record.key, e.target.value)}
//             style={{ width: 60, textAlign: 'center' }}
//             type="number"
//             min={1}
//             max={data.length}
//           />
//         ) : (
//           text
//         ),
//     },
//     {
//       title: "Trường",
//       dataIndex: "school",
//       key: "school",
//       width: 180,
//     },
//     {
//       title: "Ngành",
//       dataIndex: "major",
//       key: "major",
//       width: 180,
//     },
//     {
//       title: "Phương thức xét tuyển",
//       dataIndex: "method",
//       key: "method",
//       width: 200,
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
//         if (text) return text;
//         if (record.totalScore) return record.totalScore;
//         if (record.score) return record.score;
//         return "-";
//       },
//     },
//     {
//       title: "Thao tác",
//       key: "action",
//       width: 150,
//       render: (_: any, record: HoSo) => (
//         <Space size="small">
//           <Button
//             type="link"
//             icon={<EditOutlined />}
//             onClick={() => {
//               message.info("Chức năng sửa sẽ chuyển hướng sang form đăng ký nguyện vọng. Vui lòng quay lại sau.");
//               // TODO: Điều hướng sang trang đăng ký nguyện vọng với key để chỉnh sửa
//             }}
//             disabled={isReordering} // Vô hiệu hóa khi đang sắp xếp
//           >
//             Sửa
//           </Button>
//           <Popconfirm
//             title="Bạn có chắc chắn muốn xóa nguyện vọng này?"
//             onConfirm={() => handleDelete(record.key)}
//             okText="Có"
//             cancelText="Không"
//           >
//             <Button type="link" danger icon={<DeleteOutlined />} disabled={isReordering}>
//               Xóa
//             </Button>
//           </Popconfirm>
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
//           {/* Bỏ bộ lọc trạng thái */}
//         </Space>
//         <Space>
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => message.info("Chuyển đến trang đăng ký nguyện vọng để thêm mới.")}
//           >
//             Thêm nguyện vọng mới
//           </Button>
//           <Button icon={<DownloadOutlined />} onClick={handleExportExcel}>
//             In danh sách (Xuất Excel)
//           </Button>
//           {!isReordering ? (
//             <Button onClick={() => setIsReordering(true)}>
//               Chỉnh sửa thứ tự nguyện vọng
//             </Button>
//           ) : (
//             <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveReorder}>
//               Lưu thứ tự nguyện vọng
//             </Button>
//           )}
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
//             <Descriptions.Item label="Thứ tự NV">{selectedRecord.stt}</Descriptions.Item>
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
    form.setFieldsValue({ schoolCode: undefined, majorCode: undefined, unit: undefined, combo: undefined, calculatedScore: undefined });
  };
  const handleSchoolChange = (value: string) => {
    setSelectedSchool(value);
    form.setFieldsValue({ majorCode: undefined });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Phương thức xét tuyển" name="method" rules={[{ required: true }]}
            >
            <Select placeholder="Chọn phương thức" onChange={handleMethodChange} allowClear>
              {methods.map(m => <Option key={m} value={m}>{m}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          {selectedMethod === "Đánh giá năng lực/Đánh giá tư duy" && (
            <Form.Item label="Đơn vị tổ chức" name="unit" rules={[{ required: true }]}
              >
              <Select placeholder="Chọn đơn vị tổ chức">
                {assessmentUnits.map(u => <Option key={u} value={u}>{u}</Option>)}
              </Select>
            </Form.Item>
          )}
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Trường" name="schoolCode" rules={[{ required: true }]}
            >
            <Select placeholder="Chọn trường" onChange={handleSchoolChange} disabled={!selectedMethod} allowClear>
              {selectedMethod && schoolsByMethod[selectedMethod].map(s => <Option key={s.code} value={s.code}>{s.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Ngành" name="majorCode" rules={[{ required: true }]}
            >
            <Select placeholder="Chọn ngành" disabled={!selectedSchool} allowClear>
              {selectedSchool && majorsBySchool[selectedSchool].map(m => <Option key={m.code} value={m.code}>{m.name}</Option>)}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      {(selectedMethod === "Điểm THPT" || selectedMethod === "Học bạ") && (
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Tổ hợp môn" name="combo" rules={[{ required: true }]}
              >
              <Select placeholder="Chọn tổ hợp môn">
                {subjectCombos.map(c => <Option key={c} value={c}>{c}</Option>)}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Điểm xét tuyển" name="calculatedScore" rules={[{ required: true }]}
              >
              <InputNumber placeholder="Nhập điểm" style={{ width: '100%' }} min={0} max={40} />
            </Form.Item>
          </Col>
        </Row>
      )}

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
    const { method, unit, schoolCode, majorCode, combo, calculatedScore } = vals;
    const schoolObj = schoolsByMethod[method].find(s=>s.code===schoolCode)!;
    const majorObj = majorsBySchool[schoolCode].find(m=>m.code===majorCode)!;
    if (modalMode==='add') {
      const newRec:HoSo = {
        key: Date.now().toString(), stt: data.length+1,
        method, schoolCode, school:schoolObj.name,
        majorCode, major:majorObj.name,
        combo, unit, calculatedScore
      };
      setData(prev=>[...prev,newRec]); message.success('Thêm thành công!');
    } else if (modalMode==='edit' && editingRecord) {
      setData(prev=>prev.map(i=> i.key===editingRecord.key
        ? {...i, method, schoolCode, school:schoolObj.name, majorCode, major:majorObj.name, combo, unit, calculatedScore}
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
    { title:'Tổ hợp môn', dataIndex:'combo', key:'combo', width:150, render:t=>t||'-' },
    { title:'Đơn vị tổ chức', dataIndex:'unit', key:'unit', width:200, render:t=>t||'-' },
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
      <Space style={{marginBottom:16,width:'100%'}} justify="space-between">
        <Input.Search placeholder="Tìm (Trường, Ngành...)" onChange={e=>setSearchText(e.target.value)} allowClear style={{width:300}} />
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>Thêm nguyện vọng</Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>In danh sách</Button>
          {!isReordering ?
            <Button icon={<EditOutlined />} onClick={()=>setIsReordering(true)}>Chỉnh thứ tự</Button>
            : <Button type="primary" icon={<SaveOutlined />} onClick={handleSaveReorder}>Lưu thứ tự</Button>
          }
        </Space>
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
            calculatedScore:editingRecord!.calculatedScore,
          }:undefined}
          onCancel={()=>setModalVisible(false)}
          onSubmit={handleFormSubmit}
        />
      </Modal>
    </div>
  );
};

export default Status;
