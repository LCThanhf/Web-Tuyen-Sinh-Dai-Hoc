import React from 'react';
import { Modal, message, Button, Typography } from 'antd';
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface FilePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  fileUrl?: string;
  fileName?: string;
  title?: string;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  visible,
  onClose,
  fileUrl,
  fileName,
  title = "Xem file minh chứng"
}) => {
  const getFullFileUrl = (originalUrl: string): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5001';
    
    if (originalUrl.startsWith('http')) {
      return originalUrl;
    }
    
    // Simple URL construction for direct file access
    return `${baseUrl}${originalUrl}`;
  };

  const handleViewFile = () => {
    if (fileUrl) {
      const fullUrl = getFullFileUrl(fileUrl);
      window.open(fullUrl, '_blank');
    } else {
      message.warning("Không có file để xem.");
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const fullUrl = getFullFileUrl(fileUrl);
      const link = document.createElement('a');
      link.href = fullUrl;
      link.download = fileName || 'file';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      message.warning("Không có file để tải.");
    }
  };

  return (
    <Modal
      title={title}
      open={visible}
      onCancel={onClose}
      width={400}
      footer={[
        <Button key="view" type="primary" icon={<EyeOutlined />} onClick={handleViewFile}>
          Xem file
        </Button>,
        <Button key="download" icon={<DownloadOutlined />} onClick={handleDownload}>
          Tải xuống
        </Button>,
        <Button key="close" onClick={onClose}>
          Đóng
        </Button>,
      ]}
      style={{ top: 100 }}
    >
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Text strong>{fileName || 'File minh chứng'}</Text>
        <div style={{ marginTop: '16px' }}>
          <Text type="secondary">
            Nhấn "Xem file" để mở file trong tab mới hoặc "Tải xuống" để tải về máy.
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default FilePreviewModal;
