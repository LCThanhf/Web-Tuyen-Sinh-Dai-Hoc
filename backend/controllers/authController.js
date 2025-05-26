const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password) {
    return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
  }

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length > 0) return res.status(400).json({ message: 'Email đã tồn tại.' });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = { full_name, email, password: hashedPassword };

    User.create(newUser, (err) => {
      if (err) return res.status(500).json({ message: 'Lỗi tạo tài khoản' });
      return res.status(201).json({ message: 'Đăng ký thành công!' });
    });
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ message: 'Lỗi server' });
    if (results.length === 0) return res.status(401).json({ message: 'Email không tồn tại' });

    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Sai mật khẩu' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ message: 'Đăng nhập thành công!', token, user: { id: user.id, full_name: user.full_name, role: user.role } });
  });
};

module.exports = { register, login };
