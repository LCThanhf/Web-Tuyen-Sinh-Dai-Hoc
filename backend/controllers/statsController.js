const Application = require('../models/Application');

exports.byUniversity = (req, res) => {
  Application.countByUniversity((err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi thống kê theo trường' });
    res.json(results);
  });
};

exports.byMajor = (req, res) => {
  Application.countByMajor((err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi thống kê theo ngành' });
    res.json(results);
  });
};

exports.byStatus = (req, res) => {
  Application.countByStatus((err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi thống kê theo trạng thái' });
    res.json(results);
  });
};
