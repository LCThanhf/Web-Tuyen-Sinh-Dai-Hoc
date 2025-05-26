const db = require('../config/db');

const Major = {
  getAll: (cb) => db.query('SELECT * FROM majors', cb),
  create: (data, cb) => db.query('INSERT INTO majors SET ?', data, cb)
};

module.exports = Major;
