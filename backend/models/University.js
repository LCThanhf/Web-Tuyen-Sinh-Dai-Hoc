const db = require('../config/db');

const University = {
  getAll: (cb) => db.query('SELECT * FROM universities', cb),
  create: (name, cb) => db.query('INSERT INTO universities SET ?', { name }, cb)
};

module.exports = University;
