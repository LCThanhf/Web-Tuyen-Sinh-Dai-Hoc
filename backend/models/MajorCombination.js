const db = require('../config/db');

const MajorCombination = {
  create: (data, cb) => db.query('INSERT INTO major_combinations SET ?', data, cb),
  getByMajor: (major_id, cb) => db.query(`
    SELECT c.code FROM major_combinations mc
    JOIN combinations c ON mc.combination_id = c.id
    WHERE mc.major_id = ?
  `, [major_id], cb)
};

module.exports = MajorCombination;
