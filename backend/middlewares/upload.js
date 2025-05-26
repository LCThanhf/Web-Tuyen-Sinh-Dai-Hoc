// const multer = require('multer');
// const path = require('path');

// // Cấu hình nơi lưu trữ file và tên file
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Lưu file vào thư mục uploads
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
//   }
// });

// // Chỉ cho phép các file có định dạng .jpg, .jpeg, .png, .pdf
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = ['.jpg', '.jpeg', '.png', '.pdf'];
//   const ext = path.extname(file.originalname).toLowerCase();
//   if (allowedTypes.includes(ext)) {
//     cb(null, true); // Chấp nhận file
//   } else {
//     cb(new Error('Chỉ hỗ trợ file .jpg, .jpeg, .png, .pdf'));
//   }
// };

// const upload = multer({ storage, fileFilter });

// module.exports = upload;




const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Sửa cấu hình multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

module.exports = upload;