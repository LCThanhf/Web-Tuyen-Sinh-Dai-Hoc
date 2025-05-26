const Application = require('../models/Application');
const upload = require('../middlewares/upload');  // Import multer middleware

exports.submit = (req, res) => {
  // Dùng middleware multer để xử lý file upload
  upload.single('document')(req, res, (err) => {
    if (err) {
      console.log('Error during file upload:', err);  // In lỗi để dễ debug
      return res.status(400).json({ message: 'Lỗi upload file!' + err.message});
    }

    console.log('File received:', req.file); // Log thông tin file nhận được

    // Kiểm tra file
    if (!req.file) {
      console.log('No file uploaded');  // In ra thông báo khi không có file
      return res.status(400).json({ message: 'Vui lòng upload file minh chứng' });
    }

    // Điều chỉnh cách xử lý file trong FormData
    if (fileList.length > 0 && fileList[0].originFileObj) {
    // Đảm bảo tên field khớp với cấu hình của Multer
    formData.append("document", fileList[0].originFileObj);
    // Thêm thông tin về loại file
    formData.append("documentType", fileList[0].originFileObj.type);
  }

    // Kiểm tra các trường dữ liệu
    const { user_id, university_id, major_id, combination_id, full_name, cccd, birthdate, gender, address, phone, email, exam_score, priority_object } = req.body;
    if (!user_id || !university_id || !major_id || !combination_id || !full_name || !cccd || !birthdate || !gender || !address || !phone || !email || !exam_score || !priority_object) {
      return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
    }


    const application = {
      user_id,
      university_id,
      major_id,
      combination_id,
      full_name,
      cccd,
      birthdate,
      gender,
      address,
      phone,
      email,
      exam_score,
      priority_object,
      document_path: req.file.filename,  // Đường dẫn lưu file trong thư mục uploads
      status: 'Chờ duyệt'
    };

    Application.create(application, (err) => {
      if (err) {
        console.log('Error while saving application:', err);  // In lỗi khi không thể lưu vào DB
        return res.status(500).json({ message: 'Lỗi gửi hồ sơ' });
      }
      res.status(201).json({ message: 'Hồ sơ đã được gửi!' });
    });
  });
};

exports.getByUser = (req, res) => {
  const { user_id } = req.params;

  Application.getByUserId(user_id, (err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn hồ sơ' });
    res.json(result);
  });
};


const sendEmail = require('../utils/sendEmail');

exports.getAll = (req, res) => {
  Application.getAll((err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn' });
    res.json(result);
  });
};

exports.updateStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['Chờ duyệt', 'Đã duyệt', 'Từ chối'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
  }

  Application.updateStatus(id, status, async (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi cập nhật trạng thái' });

    // Lấy thông tin hồ sơ để gửi email
    Application.getById(id, async (err2, results) => {
      if (err2 || results.length === 0) return;
      const user = results[0];
      let subject = 'Cập nhật trạng thái hồ sơ xét tuyển';
      let html = `<p>Xin chào ${user.full_name},</p><p>Hồ sơ của bạn hiện đã được cập nhật sang trạng thái: <strong>${status}</strong>.</p>`;

      try {
        await sendEmail(user.email, subject, html);
      } catch (error) {
        console.log('Gửi email thất bại:', error);
      }
    });

    res.json({ message: 'Cập nhật trạng thái thành công và đã gửi email.' });
  });
};
