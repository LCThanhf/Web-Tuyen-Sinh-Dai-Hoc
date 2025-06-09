import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Tabs,
  Select,
  Table,
  Typography,
  Space,
  Popconfirm,
  Tag,
  Row,
  Col,
  Checkbox,
  Spin,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { studentApi, type Score } from "../../../services/studentApi";

const { TabPane } = Tabs;
const { Option } = Select;
const { Title, Text } = Typography;

// Define subjects and their categories
const subjects = {
  general: ["Toán", "Văn", "Anh"],
  natural: ["Lý", "Hóa", "Sinh"],
  social: ["Sử", "Địa", "GDCD"],
};

const allSubjectsForHkb = [
  ...subjects.general,
  ...subjects.natural,
  ...subjects.social,
];

const assessmentUnits = {
  dgnl: [
    { label: "ĐH Quốc gia Hà Nội", value: "DHQGHN" },
    { label: "ĐH Quốc gia TP.HCM", value: "DHQGTPHCM" },
  ],
  dgtd: [{ label: "ĐH Bách Khoa Hà Nội", value: "DHBK" }],
};

// Status tags for admin review
const statusTags = {
  "Chờ duyệt": "processing",
  "Đã duyệt": "success",
  "Từ chối": "error",
  "Không có điểm": "default", // New status for "no score"
};

// Interface for table data entries
interface ExamScoreEntry {
  key: string;
  examNumber: string;
  examBan: string;
  scores: { [key: string]: number | null };
  examFile: any[];
  status: keyof typeof statusTags;
}

interface HkbScoreEntry {
  key: string;
  scores: { [subject: string]: number[] }; // Raw scores for 6 terms per subject
  subjectAverages: { [subject: string]: number }; // Calculated averages for 6 terms
  averageOverall: number; // Overall average of subject averages
  hkbFile: any[];
  status: keyof typeof statusTags;
}

interface DgnlDgtdScoreEntry {
  key: string;
  type: "ĐGNL" | "ĐGTD" | null; // Allow null for "Không có điểm" case
  assessmentUnit: string | null; // Allow null for "Không có điểm" case
  assessmentScore: number | null; // Allow null for "Không có điểm" case
  assessmentFile: any[];
  status: keyof typeof statusTags;
  noScoreDeclared: boolean; // New flag to indicate "no score" declaration
}

const Scores: React.FC = () => {
  const [examForm] = Form.useForm();
  const [hkbForm] = Form.useForm();
  const [dgnlDgtdForm] = Form.useForm();

  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedExamBan, setSelectedExamBan] = useState<string | null>(null);
  const [currentEditingExamKey, setCurrentEditingExamKey] = useState<string | null>(null);
  const [currentEditingHkbKey, setCurrentEditingHkbKey] = useState<string | null>(null);
  const [currentEditingDgnlDgtdKey, setCurrentEditingDgnlDgtdKey] = useState<string | null>(null);

  // States to hold the unique submitted data for each tab
  const [examScoresTableData, setExamScoresTableData] = useState<ExamScoreEntry | null>(null);
  const [hkbScoresTableData, setHkbScoresTableData] = useState<HkbScoreEntry | null>(null);
  const [dgnlDgtdScoresTableData, setDgnlDgtdScoresTableData] = useState<DgnlDgtdScoreEntry[]>([]);

  // State for "no score" checkbox
  const [noDgnlDgtdScore, setNoDgnlDgtdScore] = useState<boolean>(false);

  // State for học bạ raw input scores
  const [hkbRawScoresData, setHkbRawScoresData] = useState<{ [subject: string]: number[] }>(() => {
    const init: { [key: string]: number[] } = {};
    allSubjectsForHkb.forEach((subj) => {
      init[subj] = Array(6).fill(0); // 6 terms
    });
    return init;
  });

  // Backend integration functions
  const mapBackendToDisplayExam = (scores: Score[]): ExamScoreEntry | null => {
    const thptScores = scores.filter(score => score.examType === 'THPT');
    if (thptScores.length === 0) return null;

    // Group scores by year and reconstruct exam entry
    const scoresByYear = thptScores.reduce((acc, score) => {
      if (!acc[score.year]) acc[score.year] = {};
      acc[score.year][score.subject] = score.score;
      return acc;
    }, {} as Record<number, Record<string, number>>);

    // Use the most recent year's data
    const latestYear = Math.max(...Object.keys(scoresByYear).map(Number));
    const latestScores = scoresByYear[latestYear];

    // Determine examBan based on subjects
    let examBan = "natural"; // default
    const hasNatural = subjects.natural.some(subj => latestScores[subj] !== undefined);
    const hasSocial = subjects.social.some(subj => latestScores[subj] !== undefined);
    
    if (hasNatural && !hasSocial) examBan = "natural";
    else if (hasSocial && !hasNatural) examBan = "social";

    return {
      key: latestYear.toString(),
      examNumber: `SBD${latestYear}`, // Mock exam number
      examBan: examBan,
      scores: latestScores,
      examFile: [], // Files would need separate handling
      status: thptScores[0].status === 'APPROVED' ? "Đã duyệt" : 
              thptScores[0].status === 'REJECTED' ? "Từ chối" : "Chờ duyệt"
    };
  };

  const mapBackendToDisplayHkb = (scores: Score[]): HkbScoreEntry | null => {
    const hkbScores = scores.filter(score => score.examType === 'COMPETENCY');
    if (hkbScores.length === 0) return null;

    // Reconstruct HKB data from backend scores
    const subjectAverages: { [subject: string]: number } = {};
    const rawScores: { [subject: string]: number[] } = {};
    
    hkbScores.forEach(score => {
      subjectAverages[score.subject] = score.score;
      rawScores[score.subject] = Array(6).fill(score.score); // Mock raw scores
    });

    const overallAverage = Object.values(subjectAverages).reduce((a, b) => a + b, 0) / Object.values(subjectAverages).length;

    return {
      key: "hkb_entry",
      scores: rawScores,
      subjectAverages: subjectAverages,
      averageOverall: overallAverage,
      hkbFile: [], // Files would need separate handling
      status: hkbScores[0].status === 'APPROVED' ? "Đã duyệt" : 
              hkbScores[0].status === 'REJECTED' ? "Từ chối" : "Chờ duyệt"
    };
  };

  const mapBackendToDisplayDgnl = (scores: Score[]): DgnlDgtdScoreEntry[] => {
    const dgnlScores = scores.filter(score => score.examType === 'DGNL');
    
    return dgnlScores.map(score => {
      // Parse the subject field to extract type and assessment unit
      const subjectParts = score.subject.split('_');
      const type = subjectParts[0] as "ĐGNL" | "ĐGTD";
      const assessmentUnit = subjectParts.slice(1).join('_');

      return {
        key: score.id || Date.now().toString(),
        type: type,
        assessmentUnit: assessmentUnit,
        assessmentScore: score.score,
        assessmentFile: [], // Files would need separate handling
        status: score.status === 'APPROVED' ? "Đã duyệt" : 
                score.status === 'REJECTED' ? "Từ chối" : "Chờ duyệt",
        noScoreDeclared: false
      };
    });
  };

  const loadScoresFromBackend = async () => {
    try {
      setLoading(true);
      const scores = await studentApi.getScores();
      
      // Map backend data to display format
      const examData = mapBackendToDisplayExam(scores);
      const hkbData = mapBackendToDisplayHkb(scores);
      const dgnlData = mapBackendToDisplayDgnl(scores);

      setExamScoresTableData(examData);
      setHkbScoresTableData(hkbData);
      setDgnlDgtdScoresTableData(dgnlData);

      // Update HKB raw scores if data exists
      if (hkbData) {
        setHkbRawScoresData(hkbData.scores);
      }

    } catch (error) {
      console.error('Failed to load scores:', error);
      message.error('Không thể tải dữ liệu điểm số. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadScoresFromBackend();
  }, []);

  // Calculate average score for 6 terms of a subject
  const calculateSubjectAverage = (subjectScores: number[]): number => {
    const validScores = subjectScores.filter(
      (score) => typeof score === "number" && score >= 0 && score <= 10
    );
    if (validScores.length === 0) return 0;
    return validScores.reduce((a, b) => a + b, 0) / validScores.length;
  };

  // Calculate overall average for HKB (average of subjects included in allSubjectsForHkb)
  const averageOverallHkbScore = (): number => {
    let totalSubjectAverages = 0;
    let countSubjectsWithData = 0;

    allSubjectsForHkb.forEach((subj) => {
      const subjectAvg = calculateSubjectAverage(hkbRawScoresData[subj]);
      if (subjectAvg > 0) {
        totalSubjectAverages += subjectAvg;
        countSubjectsWithData++;
      }
    });
    return countSubjectsWithData === 0 ? 0 : totalSubjectAverages / countSubjectsWithData;
  };

  // HKB table columns for input
  const hkbInputTableColumns = [
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
      fixed: "left" as const,
      width: 120,
    },
    ...Array.from({ length: 6 }, (_, i) => ({
      title: `Kỳ ${Math.floor(i / 2) + 1} (Lớp ${10 + Math.floor(i / 2)})`,
      dataIndex: `term${i + 1}`,
      key: `term${i + 1}`,
      width: 100,
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          max={10}
          step={0.1}
          style={{ width: "90%" }}
          value={hkbRawScoresData[record.subject][i]}
          onChange={(value) => {
            setHkbRawScoresData((prev) => {
              const newData = { ...prev };
              // Ensure value is a number, default to 0 if null/undefined
              newData[record.subject][i] = value !== null && value !== undefined ? value : 0;
              return newData;
            });
          }}
        />
      ),
    })),
    {
      title: "Điểm TB môn (6 kỳ)",
      dataIndex: "subjectAverage",
      key: "subjectAverage",
      width: 150,
      render: (_: any, record: any) => (
        <Text strong>{calculateSubjectAverage(hkbRawScoresData[record.subject]).toFixed(2)}</Text>
      ),
    },
  ];

  // Data source for HKB input table
  const hkbInputDataSource = allSubjectsForHkb.map((subj) => ({
    key: subj,
    subject: subj,
  }));

  // --- THPT Exam Score Handlers ---
  const onExamFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const relevantSubjects = [...subjects.general];
      if (values.examBan === "natural") {
        relevantSubjects.push(...subjects.natural);
      } else if (values.examBan === "social") {
        relevantSubjects.push(...subjects.social);
      }

      const currentYear = new Date().getFullYear();
      
      // Save each subject score to backend
      const savePromises = relevantSubjects.map(async (subject) => {
        const score = values[`score${subject}`];
        if (score !== null && score !== undefined) {
          return await studentApi.saveScore({
            examType: 'THPT',
            subject: subject,
            score: score,
            year: currentYear
          });
        }
      });

      await Promise.all(savePromises.filter(Boolean));

      // Create local display entry
      const scores: { [key: string]: number | null } = {};
      relevantSubjects.forEach((subj) => {
        scores[subj] = values[`score${subj}`];
      });

      const newEntry: ExamScoreEntry = {
        key: Date.now().toString(),
        examNumber: values.examNumber,
        examBan: values.examBan,
        scores: scores,
        examFile: values.examFile ? values.examFile.map((file: any) => file.originFileObj) : [],
        status: "Chờ duyệt",
      };

      setExamScoresTableData(newEntry);
      message.success("Lưu điểm thi THPT thành công! Chờ admin duyệt.");
      examForm.resetFields();
      setSelectedExamBan(null);
      setCurrentEditingExamKey(null);
    } catch (error) {
      console.error('Failed to save exam scores:', error);
      message.error('Không thể lưu điểm thi THPT. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditExamScore = () => {
    if (examScoresTableData) {
      // Set form fields with existing data for editing
      examForm.setFieldsValue({
        examNumber: examScoresTableData.examNumber,
        examBan: examScoresTableData.examBan,
        ...Object.keys(examScoresTableData.scores).reduce((acc: any, subj) => {
          acc[`score${subj}`] = examScoresTableData.scores[subj];
          return acc;
        }, {}),
        // For file upload, you might need to handle Antd's fileList structure
        // This is a simplified representation, a real app might need file URLs
        examFile: examScoresTableData.examFile.length > 0 ? [{ uid: '-1', name: 'uploaded_file', status: 'done', url: URL.createObjectURL(examScoresTableData.examFile[0]) }] : [],
      });
      setSelectedExamBan(examScoresTableData.examBan);
      setCurrentEditingExamKey(examScoresTableData.key);
      message.info("Bạn đang chỉnh sửa điểm thi THPT.");
    }
  };

  const handleDeleteExamScore = async () => {
    try {
      setSubmitting(true);
      
      // Note: In a real implementation, you'd need to track score IDs from backend
      // For now, we'll clear local data and could implement API call when IDs are available
      
      // TODO: Delete individual scores from backend when score IDs are properly tracked
      // if (examScoresTableData && examScoresTableData.scoreIds) {
      //   await Promise.all(examScoresTableData.scoreIds.map(id => studentApi.deleteScore(id)));
      // }
      
      setExamScoresTableData(null); // Remove the single entry
      message.success("Xóa điểm thi THPT thành công!");
      examForm.resetFields();
      setSelectedExamBan(null);
      setCurrentEditingExamKey(null);
    } catch (error) {
      console.error('Failed to delete exam scores:', error);
      message.error('Không thể xóa điểm thi THPT. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const examTableDisplayColumns = [
    {
      title: "SBD",
      dataIndex: "examNumber",
      key: "examNumber",
    },
    {
      title: "Bạn thi",
      dataIndex: "examBan",
      key: "examBan",
      render: (ban: string) => {
        if (ban === "general") return "Khối chung";
        if (ban === "natural") return "Khoa học tự nhiên";
        if (ban === "social") return "Khoa học xã hội";
        return ban;
      }
    },
    {
      title: "Điểm các môn",
      key: "scores",
      render: (_: any, record: ExamScoreEntry) => (
        <>
          {Object.entries(record.scores).map(([subject, score]) => (
            <div key={subject}>
              <Text strong>{subject}:</Text> {score !== null ? score : "N/A"}
            </div>
          ))}
        </>
      ),
    },
    {
      title: "Minh chứng",
      dataIndex: "examFile",
      key: "examFile",
      render: (files: any[]) =>
        files.length > 0 ? (
          <a href={URL.createObjectURL(files[0])} target="_blank" rel="noopener noreferrer">
            Xem file
          </a>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusTags) => (
        <Tag color={statusTags[status]}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ExamScoreEntry) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={handleEditExamScore}
            disabled={record.status !== "Chờ duyệt"} // Only allow edit if "Chờ duyệt"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa điểm này?"
            onConfirm={handleDeleteExamScore}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={record.status !== "Chờ duyệt"} // Only allow delete if "Chờ duyệt"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // --- HKB Score Handlers ---
  const onHkbFinish = async () => {
    try {
      await hkbForm.validateFields();
      setSubmitting(true);

      const values = hkbForm.getFieldsValue();
      const subjectAverages: { [subject: string]: number } = {};
      
      // Calculate subject averages and save to backend
      const savePromises = allSubjectsForHkb.map(async (subject) => {
        const average = calculateSubjectAverage(hkbRawScoresData[subject]);
        subjectAverages[subject] = average;
        
        if (average > 0) {
          return await studentApi.saveScore({
            examType: 'COMPETENCY',
            subject: subject,
            score: average,
            year: new Date().getFullYear()
          });
        }
      });

      await Promise.all(savePromises.filter(Boolean));

      // Create local display entry
      const newEntry: HkbScoreEntry = {
        key: Date.now().toString(),
        scores: { ...hkbRawScoresData }, // Raw scores for backup/admin view
        subjectAverages: subjectAverages, // Calculated averages
        averageOverall: parseFloat(averageOverallHkbScore().toFixed(2)),
        hkbFile: values.hkbFile ? values.hkbFile.map((file: any) => file.originFileObj) : [],
        status: "Chờ duyệt",
      };
      
      setHkbScoresTableData(newEntry); // Store as a single entry
      message.success("Lưu điểm học bạ thành công! Chờ admin duyệt.");
      hkbForm.resetFields();
      
      // Reset raw scores data
      setHkbRawScoresData(() => {
        const init: { [key: string]: number[] } = {};
        allSubjectsForHkb.forEach((subj) => {
          init[subj] = Array(6).fill(0);
        });
        return init;
      });
      setCurrentEditingHkbKey(null);
    } catch (error) {
      console.error('Failed to save HKB scores:', error);
      message.error("Không thể lưu điểm học bạ. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditHkbScore = () => {
    if (hkbScoresTableData) {
      // Set raw scores data back to the input table
      setHkbRawScoresData({ ...hkbScoresTableData.scores });
      // Set file in the form (simplified)
      hkbForm.setFieldsValue({
        hkbFile: hkbScoresTableData.hkbFile.length > 0 ? [{ uid: '-1', name: 'uploaded_file', status: 'done', url: URL.createObjectURL(hkbScoresTableData.hkbFile[0]) }] : [],
      });
      setCurrentEditingHkbKey(hkbScoresTableData.key);
      message.info("Bạn đang chỉnh sửa điểm học bạ.");
    }
  };

  const handleDeleteHkbScore = async () => {
    try {
      setSubmitting(true);
      
      // Note: In a real implementation, you'd need to track score IDs from backend
      // For now, we'll clear local data and could implement API call when IDs are available
      
      // TODO: Delete individual scores from backend when score IDs are properly tracked
      // if (hkbScoresTableData && hkbScoresTableData.scoreIds) {
      //   await Promise.all(hkbScoresTableData.scoreIds.map(id => studentApi.deleteScore(id)));
      // }
      
      setHkbScoresTableData(null);
      message.success("Xóa điểm học bạ thành công!");
      hkbForm.resetFields();
      setHkbRawScoresData(() => { // Reset raw scores as well
        const init: { [key: string]: number[] } = {};
        allSubjectsForHkb.forEach((subj) => {
          init[subj] = Array(6).fill(0);
        });
        return init;
      });
      setCurrentEditingHkbKey(null);
    } catch (error) {
      console.error('Failed to delete HKB scores:', error);
      message.error('Không thể xóa điểm học bạ. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const hkbTableDisplayColumns = [
    {
      title: "Điểm TB tổng (6 kỳ)",
      dataIndex: "averageOverall",
      key: "averageOverall",
      render: (text: number) => <Text strong>{text.toFixed(2)}</Text>,
    },
    {
      title: "Minh chứng",
      dataIndex: "hkbFile",
      key: "hkbFile",
      render: (files: any[]) =>
        files.length > 0 ? (
          <a href={URL.createObjectURL(files[0])} target="_blank" rel="noopener noreferrer">
            Xem file
          </a>
        ) : (
          "Không có"
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusTags) => (
        <Tag color={statusTags[status]}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: HkbScoreEntry) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={handleEditHkbScore}
            disabled={record.status !== "Chờ duyệt"}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa điểm này?"
            onConfirm={handleDeleteHkbScore}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={record.status !== "Chờ duyệt"}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Columns to display subject averages for HKB
  const hkbSubjectAveragesColumns = [
    {
      title: "Môn học",
      dataIndex: "subject",
      key: "subject",
    },
    {
      title: "Điểm TB 6 kỳ",
      dataIndex: "average",
      key: "average",
      render: (text: number) => <Text strong>{text.toFixed(2)}</Text>,
    },
  ];

  const hkbSubjectAveragesDataSource = hkbScoresTableData
    ? Object.entries(hkbScoresTableData.subjectAverages).map(([subject, average]) => ({
        key: subject,
        subject: subject,
        average: average,
      }))
    : [];

  // --- ĐGNL/ĐGTD Handlers ---
  const [selectedAssessmentType, setSelectedAssessmentType] = useState<"ĐGNL" | "ĐGTD" | null>(null);

  // Helper function to get available assessment units for a type
  const getAvailableUnits = (assessmentType: "ĐGNL" | "ĐGTD") => {
    const allUnits = assessmentType === "ĐGNL" ? assessmentUnits.dgnl : assessmentUnits.dgtd;
    // Filter out units already used by other (non-editing) entries of the same type
    const usedUnits = dgnlDgtdScoresTableData
      .filter(entry => entry.type === assessmentType && entry.key !== currentEditingDgnlDgtdKey && !entry.noScoreDeclared)
      .map(entry => entry.assessmentUnit);
    return allUnits.filter(unit => !usedUnits.includes(unit.value));
  };

  const onDgnlDgtdFinish = async (values: any) => {
    try {
      setSubmitting(true);
      const { assessmentType, assessmentUnit, assessmentScore, assessmentFile, noScoreDeclared } = values;

      if (noScoreDeclared) {
        // If "no score" is declared, save a special entry
        const newEntry: DgnlDgtdScoreEntry = {
          key: currentEditingDgnlDgtdKey || Date.now().toString(),
          type: null, // Null type as no specific exam was taken
          assessmentUnit: null, // Null unit
          assessmentScore: null, // Null score
          assessmentFile: [], // No file needed
          status: "Không có điểm", // Custom status
          noScoreDeclared: true,
        };

        if (currentEditingDgnlDgtdKey) {
          setDgnlDgtdScoresTableData(prev =>
            prev.map(entry => entry.key === currentEditingDgnlDgtdKey ? newEntry : entry)
          );
          message.success("Cập nhật trạng thái không có điểm ĐGNL/ĐGTD thành công!");
        } else {
          // Prevent adding multiple "no score" entries
          if (dgnlDgtdScoresTableData.some(entry => entry.noScoreDeclared)) {
            message.error("Bạn đã khai báo là không có điểm ĐGNL/ĐGTD rồi.");
            return;
          }
          setDgnlDgtdScoresTableData(prev => [...prev, newEntry]);
          message.success("Khai báo không có điểm ĐGNL/ĐGTD thành công!");
        }
      } else {
        // If score is being entered, proceed with validation and save
        // Check if an entry for this type and unit already exists (only if not editing)
        if (!currentEditingDgnlDgtdKey) {
          const existingEntry = dgnlDgtdScoresTableData.find(
            entry => entry.type === assessmentType && entry.assessmentUnit === assessmentUnit && !entry.noScoreDeclared
          );
          if (existingEntry) {
            message.error(`Bạn đã có điểm ${assessmentType} cho đơn vị ${existingEntry.assessmentUnit} rồi. Không thể thêm trùng lặp.`);
            return;
          }
        }

        // Save to backend
        await studentApi.saveScore({
          examType: 'DGNL', // Both ĐGNL and ĐGTD map to DGNL type
          subject: `${assessmentType}_${assessmentUnit}`, // Store type and unit in subject field
          score: assessmentScore,
          year: new Date().getFullYear()
        });

        const newEntry: DgnlDgtdScoreEntry = {
          key: currentEditingDgnlDgtdKey || Date.now().toString(),
          type: assessmentType,
          assessmentUnit: assessmentUnit,
          assessmentScore: assessmentScore,
          assessmentFile: assessmentFile
            ? assessmentFile.map((file: any) => file.originFileObj)
            : [],
          status: "Chờ duyệt",
          noScoreDeclared: false,
        };

        if (currentEditingDgnlDgtdKey) {
          // Update existing entry
          setDgnlDgtdScoresTableData(prev =>
            prev.map(entry => entry.key === currentEditingDgnlDgtdKey ? newEntry : entry)
          );
          message.success(`Cập nhật điểm ${assessmentType} thành công!`);
        } else {
          // Add new entry
          setDgnlDgtdScoresTableData(prev => [...prev, newEntry]);
          message.success(`Lưu điểm ${assessmentType} thành công! Chờ admin duyệt.`);
        }
      }

      dgnlDgtdForm.resetFields();
      setSelectedAssessmentType(null);
      setCurrentEditingDgnlDgtdKey(null);
      setNoDgnlDgtdScore(false); // Reset checkbox
    } catch (error) {
      console.error('Failed to save DGNL/DGTD scores:', error);
      message.error('Không thể lưu điểm ĐGNL/ĐGTD. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditDgnlDgtdScore = (record: DgnlDgtdScoreEntry) => {
    if (record.noScoreDeclared) {
      // If editing a "no score" entry
      setNoDgnlDgtdScore(true);
      dgnlDgtdForm.setFieldsValue({
        noScoreDeclared: true,
        assessmentType: null,
        assessmentUnit: null,
        assessmentScore: null,
        assessmentFile: [],
      });
    } else {
      // If editing a normal score entry
      setNoDgnlDgtdScore(false);
      dgnlDgtdForm.setFieldsValue({
        noScoreDeclared: false,
        assessmentType: record.type,
        assessmentUnit: record.assessmentUnit,
        assessmentScore: record.assessmentScore,
        assessmentFile: record.assessmentFile.length > 0 ? [{ uid: '-1', name: 'uploaded_file', status: 'done', url: URL.createObjectURL(record.assessmentFile[0]) }] : [],
      });
    }
    setSelectedAssessmentType(record.type);
    setCurrentEditingDgnlDgtdKey(record.key);
    message.info("Bạn đang chỉnh sửa thông tin ĐGNL/ĐGTD.");
  };

  const handleDeleteDgnlDgtdScore = async (record: DgnlDgtdScoreEntry) => {
    try {
      setSubmitting(true);
      
      // Note: In a real implementation, you'd need to track score IDs from backend
      // For now, we'll clear local data and could implement API call when IDs are available
      
      // TODO: Delete score from backend when score IDs are properly tracked
      // if (record.scoreId) {
      //   await studentApi.deleteScore(record.scoreId);
      // }
      
      setDgnlDgtdScoresTableData(prev => prev.filter(entry => entry.key !== record.key));
      message.success("Xóa thông tin ĐGNL/ĐGTD thành công!");

      // If we're currently editing this entry, reset the form
      if (currentEditingDgnlDgtdKey === record.key) {
        dgnlDgtdForm.resetFields();
        setSelectedAssessmentType(null);
        setCurrentEditingDgnlDgtdKey(null);
        setNoDgnlDgtdScore(false);
      }
    } catch (error) {
      console.error('Failed to delete DGNL/DGTD score:', error);
      message.error('Không thể xóa điểm ĐGNL/ĐGTD. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  const dgnlDgtdTableDisplayColumns = [
    {
      title: "Loại hình",
      dataIndex: "type",
      key: "type",
      render: (type: "ĐGNL" | "ĐGTD" | null, record: DgnlDgtdScoreEntry) => {
        if (record.noScoreDeclared) return "Không có";
        return type;
      }
    },
    {
      title: "Đơn vị tổ chức",
      dataIndex: "assessmentUnit",
      key: "assessmentUnit",
      render: (unitValue: string | null, record: DgnlDgtdScoreEntry) => {
        if (record.noScoreDeclared) return "Không có";
        const units = record.type === "ĐGNL" ? assessmentUnits.dgnl : assessmentUnits.dgtd;
        const foundUnit = units.find(au => au.value === unitValue);
        return foundUnit ? foundUnit.label : unitValue;
      }
    },
    {
      title: "Điểm thi",
      dataIndex: "assessmentScore",
      key: "assessmentScore",
      render: (score: number | null, record: DgnlDgtdScoreEntry) => {
        if (record.noScoreDeclared) return "Không có";
        return score;
      }
    },
    {
      title: "Minh chứng",
      dataIndex: "assessmentFile",
      key: "assessmentFile",
      render: (files: any[], record: DgnlDgtdScoreEntry) => {
        if (record.noScoreDeclared) return "Không có";
        return files.length > 0 ? (
          <a href={URL.createObjectURL(files[0])} target="_blank" rel="noopener noreferrer">
            Xem file
          </a>
        ) : (
          "Không có"
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: keyof typeof statusTags) => (
        <Tag color={statusTags[status]}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: DgnlDgtdScoreEntry) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEditDgnlDgtdScore(record)}
            disabled={record.status !== "Chờ duyệt" && record.status !== "Không có điểm"} // Allow edit if "Chờ duyệt" or "Không có điểm"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa điểm này?"
            onConfirm={() => handleDeleteDgnlDgtdScore(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              disabled={record.status !== "Chờ duyệt" && record.status !== "Không có điểm"} // Allow delete if "Chờ duyệt" or "Không có điểm"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Determine if there's already a "no score declared" entry
  const hasNoScoreEntry = dgnlDgtdScoresTableData.some(entry => entry.noScoreDeclared);

  // Determine if a normal score entry already exists and is not currently being edited
  const hasExistingNormalScoreEntry = dgnlDgtdScoresTableData.some(entry => !entry.noScoreDeclared && entry.key !== currentEditingDgnlDgtdKey);

  // Determine if the "no score" checkbox should be disabled
  const disableNoScoreCheckbox = !currentEditingDgnlDgtdKey && hasExistingNormalScoreEntry;

  return (
    <Spin spinning={loading} tip="Đang tải dữ liệu điểm số...">
      <Tabs defaultActiveKey="1" centered size="large" style={{ padding: "20px" }}>
      {/* --- Điểm thi THPT Tab --- */}
      <TabPane tab="Điểm thi THPT" key="1">
        <Form
          form={examForm}
          layout="vertical"
          onFinish={onExamFinish}
          style={{ maxWidth: 700, margin: "auto", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px" }}
          initialValues={{ examBan: null }} // Ensure initial value for select
        >
          <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>Nhập điểm thi THPT</Title>
          <Form.Item
            label="Số báo danh"
            name="examNumber"
            rules={[{ required: true, message: "Vui lòng nhập số báo danh" }]}
          >
            <Input placeholder="Nhập số báo danh" disabled={!!currentEditingExamKey} />
          </Form.Item>

          <Form.Item
            label="Bạn thi"
            name="examBan"
            rules={[{ required: true, message: "Vui lòng chọn bạn thi" }]}
          >
            <Select
              placeholder="Chọn bạn thi"
              onChange={(value) => {
                setSelectedExamBan(value);
                // Reset subject scores when "ban" changes, but only if not editing
                if (!currentEditingExamKey) {
                  allSubjectsForHkb.forEach(subj => {
                    examForm.setFieldsValue({ [`score${subj}`]: null });
                  });
                }
              }}
              disabled={!!currentEditingExamKey} // Disable if editing existing entry
            >
              {/* <Option value="general">Khối chung (Toán, Văn, Anh)</Option> */}
              <Option value="natural">Khoa học tự nhiên (Lý, Hóa, Sinh)</Option>
              <Option value="social">Khoa học xã hội (Sử, Địa, GDCD)</Option>
            </Select>
          </Form.Item>

          {selectedExamBan && (
            <Row gutter={[16, 16]}>
              {/* Common subjects */}
              {subjects.general.map((subject) => (
                <Col xs={24} sm={8} key={`exam-${subject}`}>
                  <Form.Item
                    label={`Điểm ${subject}`}
                    name={`score${subject}`}
                    rules={[
                      { required: true, message: `Vui lòng nhập điểm ${subject}` },
                      { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
                    ]}
                  >
                    <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
                  </Form.Item>
                </Col>
              ))}

              {/* Natural subjects */}
              {selectedExamBan === "natural" &&
                subjects.natural.map((subject) => (
                  <Col xs={24} sm={8} key={`exam-${subject}`}>
                    <Form.Item
                      label={`Điểm ${subject}`}
                      name={`score${subject}`}
                      rules={[
                        { required: true, message: `Vui lòng nhập điểm ${subject}` },
                        { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                ))}

              {/* Social subjects */}
              {selectedExamBan === "social" &&
                subjects.social.map((subject) => (
                  <Col xs={24} sm={8} key={`exam-${subject}`}>
                    <Form.Item
                      label={`Điểm ${subject}`}
                      name={`score${subject}`}
                      rules={[
                        { required: true, message: `Vui lòng nhập điểm ${subject}` },
                        { type: "number", min: 0, max: 10, message: "Điểm phải từ 0 đến 10" },
                      ]}
                    >
                      <InputNumber style={{ width: "100%" }} min={0} max={10} step={0.1} />
                    </Form.Item>
                  </Col>
                ))}
            </Row>
          )}

          <Form.Item
            label="File minh chứng điểm thi"
            name="examFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
              <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '186px' }} 
              disabled={!!examScoresTableData && !currentEditingExamKey}
              loading={submitting}
            >
              {currentEditingExamKey ? "Cập nhật điểm thi THPT" : "Lưu điểm thi THPT"}
            </Button>
          </Form.Item>
        </Form>


        <Title level={4} style={{ textAlign: "center", marginTop: "40px", marginBottom: "24px" }}>
          Thông tin điểm thi THPT của bạn
        </Title>
        {examScoresTableData ? (
          <Table
            columns={examTableDisplayColumns}
            dataSource={[examScoresTableData]} // Wrap in array for Table component
            pagination={false}
            scroll={{ x: true }}
            bordered
          />
        ) : (
          <Text type="secondary" style={{ textAlign: "center", display: "block", padding: "20px" }}>
            Chưa có thông tin điểm thi THPT nào được nhập.
          </Text>
        )}
      </TabPane>

      {/* --- Học bạ Tab --- */}
      <TabPane tab="Điểm học bạ" key="2">
        <Form
          form={hkbForm}
          layout="vertical"
          onFinish={onHkbFinish}
          style={{ maxWidth: 1000, margin: "auto", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px" }}
        >
          <Title level={4} style={{ textAlign: "center", marginBottom: "24px" }}>Nhập điểm học bạ</Title>
          <Title level={5} style={{marginBottom: "16px"}}>Nhập điểm trung bình từng môn theo kỳ</Title>
          <Table
            columns={hkbInputTableColumns}
            dataSource={hkbInputDataSource}
            pagination={false}
            scroll={{ x: 900 }}
            bordered
            size="small"
          />
          {/* Removed: Điểm trung bình tổng 11 môn 6 kỳ */}

          <Form.Item
            label="File minh chứng học bạ"
            name="hkbFile"
            valuePropName="fileList"
            getValueFromEvent={(e: any) => e && e.fileList}
            rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
            style={{ marginTop: '16px' }}
          >
            <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
              <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              style={{ width: '186px' }} 
              disabled={!!hkbScoresTableData && !currentEditingHkbKey}
              loading={submitting}
            >
              {currentEditingHkbKey ? "Cập nhật điểm học bạ" : "Lưu điểm học bạ"}
            </Button>
          </Form.Item>
        </Form>


        <Title level={4} style={{ textAlign: "center", marginTop: "40px", marginBottom: "24px" }}>
          Thông tin điểm học bạ của bạn
        </Title>
        {hkbScoresTableData ? (
          <>
            <Table
              columns={hkbTableDisplayColumns}
              dataSource={[hkbScoresTableData]}
              pagination={false}
              scroll={{ x: true }}
              bordered
              style={{ marginBottom: '20px' }}
            />
            <Title level={5} style={{ textAlign: "center", marginTop: "20px", marginBottom: "15px" }}>
              Điểm trung bình 6 kỳ của từng môn
            </Title>
            <Table
              columns={hkbSubjectAveragesColumns}
              dataSource={hkbSubjectAveragesDataSource}
              pagination={false}
              size="small"
              bordered
              style={{ maxWidth: 400, margin: 'auto' }}
            />
          </>
        ) : (
          <Text type="secondary" style={{ textAlign: "center", display: "block", padding: "20px" }}>
            Chưa có thông tin điểm học bạ nào được nhập.
          </Text>
        )}
      </TabPane>

      {/* --- Đánh giá năng lực/tư duy Tab --- */}
      <TabPane tab="Đánh giá năng lực/tư duy" key="3">
        <Form
          form={dgnlDgtdForm}
          layout="vertical"
          onFinish={onDgnlDgtdFinish}
          style={{ maxWidth: 700, margin: "auto", padding: "20px", border: "1px solid #f0f0f0", borderRadius: "8px" }}
        >
          <Title level={4} style={{ textAlign: "center", marginBottom: "16px" }}>Nhập điểm Đánh giá năng lực/tư duy</Title>

          <Form.Item
            name="noScoreDeclared"
            valuePropName="checked"
            initialValue={false}
          >
            <Checkbox
              onChange={(e) => {
                const checked = e.target.checked;
                setNoDgnlDgtdScore(checked);
                // Reset other fields if "no score" is checked
                if (checked) {
                  dgnlDgtdForm.setFieldsValue({
                    assessmentType: null,
                    assessmentUnit: null,
                    assessmentScore: null,
                    assessmentFile: [],
                  });
                  setSelectedAssessmentType(null); // Reset selected type
                }
              }}
              disabled={disableNoScoreCheckbox} // Disable if there's already a normal entry and not editing it
            >
              Tôi không có điểm ĐGNL/ĐGTD
            </Checkbox>
          </Form.Item>
          {!currentEditingDgnlDgtdKey && hasNoScoreEntry && (
             <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: '4px' }}>
             <Text type="warning">
               Bạn đã khai báo không có điểm ĐGNL/ĐGTD. Để nhập điểm, vui lòng xóa khai báo cũ trước.
             </Text>
           </div>
          )}
          {disableNoScoreCheckbox && !noDgnlDgtdScore && (
             <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: '4px' }}>
             <Text type="warning">
               Bạn đã có thông tin điểm ĐGNL/ĐGTD. Không thể khai báo không có điểm khi đã có điểm.
             </Text>
           </div>
          )}

          {!noDgnlDgtdScore && ( // Only show these fields if "no score" is NOT checked
            <>
              <Form.Item
                label="Loại hình đánh giá"
                name="assessmentType"
                rules={[{ required: true, message: "Vui lòng chọn loại hình đánh giá" }]}
              >
                <Select placeholder="Chọn loại hình" onChange={(value: "ĐGNL" | "ĐGTD") => {
                  setSelectedAssessmentType(value);
                  dgnlDgtdForm.setFieldsValue({ assessmentUnit: null }); // Reset unit when type changes
                }} disabled={!!currentEditingDgnlDgtdKey}>
                  <Option value="ĐGNL">Đánh giá năng lực (ĐGNL)</Option>
                  <Option value="ĐGTD">Đánh giá tư duy (ĐGTD)</Option>
                </Select>
              </Form.Item>

              {selectedAssessmentType && (
                <>
                  <Form.Item
                    label="Đơn vị tổ chức"
                    name="assessmentUnit"
                    rules={[{ required: true, message: "Vui lòng chọn đơn vị tổ chức" }]}
                  >
                    <Select
                      placeholder="Chọn đơn vị tổ chức"
                      disabled={currentEditingDgnlDgtdKey ? false : getAvailableUnits(selectedAssessmentType).length === 0}
                    >
                      {currentEditingDgnlDgtdKey ? (
                        // When editing, show all units for the selected type
                        selectedAssessmentType === "ĐGNL" ? assessmentUnits.dgnl.map(({ label, value }) => (
                          <Option key={value} value={value}>
                            {label}
                          </Option>
                        )) : assessmentUnits.dgtd.map(({ label, value }) => (
                          <Option key={value} value={value}>
                            {label}
                          </Option>
                        ))
                      ) : (
                        // When adding new, only show available units
                        getAvailableUnits(selectedAssessmentType).map(({ label, value }) => (
                          <Option key={value} value={value}>
                            {label}
                          </Option>
                        ))
                      )}
                    </Select>
                  </Form.Item>

                  {!currentEditingDgnlDgtdKey && getAvailableUnits(selectedAssessmentType).length === 0 && (
                    <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: '#fff7e6', border: '1px solid #ffd591', borderRadius: '4px' }}>
                      <Text type="warning">
                        Bạn đã nhập điểm cho tất cả các đơn vị của {selectedAssessmentType}.
                        {selectedAssessmentType === "ĐGNL" && " (Đã có điểm cho cả ĐH Quốc gia Hà Nội và ĐH Quốc gia TP.HCM)"}
                        {selectedAssessmentType === "ĐGTD" && " (Đã có điểm cho ĐH Bách Khoa Hà Nội)"}
                      </Text>
                    </div>
                  )}
                </>
              )}

              <Form.Item
                label="Điểm thi"
                name="assessmentScore"
                rules={[
                  { required: true, message: "Vui lòng nhập điểm thi" },
                  { type: "number", min: 0, max: 150, message: "Điểm từ 0 đến 150" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  max={150}
                  step={0.1}
                />
              </Form.Item>

              <Form.Item
                label="File minh chứng điểm thi"
                name="assessmentFile"
                valuePropName="fileList"
                getValueFromEvent={(e: any) => e && e.fileList}
                rules={[{ required: true, message: "Vui lòng upload file minh chứng" }]}
              >
                <Upload beforeUpload={() => false} maxCount={1} accept=".pdf,.jpg,.png">
                  <Button icon={<UploadOutlined />}>Chọn file minh chứng</Button>
                </Upload>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '220px' }}
              loading={submitting}
              disabled={
                // Disable if adding new and all units are entered for the selected type
                (!currentEditingDgnlDgtdKey && !noDgnlDgtdScore && selectedAssessmentType && getAvailableUnits(selectedAssessmentType).length === 0) ||
                // Disable if trying to add a new normal entry while a "no score" entry exists
                (!currentEditingDgnlDgtdKey && !noDgnlDgtdScore && hasNoScoreEntry) ||
                // Disable if trying to add a "no score" entry while a normal entry exists
                (!currentEditingDgnlDgtdKey && noDgnlDgtdScore && hasExistingNormalScoreEntry)
              }
            >
              {currentEditingDgnlDgtdKey ? (noDgnlDgtdScore ? "Cập nhật khai báo" : "Cập nhật điểm ĐGNL/ĐGTD") : (noDgnlDgtdScore ? "Khai báo không có điểm" : "Lưu điểm ĐGNL/ĐGTD")}
            </Button>
          </Form.Item>
        </Form>


        <Title level={4} style={{ textAlign: "center", marginTop: "40px", marginBottom: "24px" }}>
          Thông tin điểm Đánh giá năng lực/tư duy của bạn
        </Title>
        {dgnlDgtdScoresTableData.length > 0 ? (
          <Table
            columns={dgnlDgtdTableDisplayColumns}
            dataSource={dgnlDgtdScoresTableData}
            pagination={false}
            scroll={{ x: true }}
            bordered
          />
        ) : (
          <Text type="secondary" style={{ textAlign: "center", display: "block", padding: "20px" }}>
            Chưa có thông tin điểm Đánh giá năng lực/tư duy nào được nhập hoặc khai báo.
          </Text>
        )}
      </TabPane>
    </Tabs>
    </Spin>
  );
};

export default Scores;