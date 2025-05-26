const db = require('../config/db');

const Combination = {
  getAll: (cb) => db.query('SELECT * FROM combinations', cb),
  create: (data, cb) => db.query('INSERT INTO combinations SET ?', data, cb)
};

module.exports = Combination;
