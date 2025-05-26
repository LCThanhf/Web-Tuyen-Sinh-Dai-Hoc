const University = require('../models/University');

exports.getAll = (req, res) => {
  University.getAll((err, result) => {
    if (err) return res.status(500).json({ message: 'Lỗi truy vấn' });
    res.json(result);
  });
};

exports.create = (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: 'Thiếu tên trường' });

  University.create(name, (err) => {
    if (err) return res.status(500).json({ message: 'Lỗi thêm trường' });
    res.status(201).json({ message: 'Đã thêm trường' });
  });
};
