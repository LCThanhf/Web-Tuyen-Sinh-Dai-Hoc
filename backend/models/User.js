const db = require('../config/db');

const User = {
  findByEmail: (email, callback) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], callback);
  },

  create: (userData, callback) => {
    db.query('INSERT INTO users SET ?', userData, callback);
  }
};

module.exports = User;
