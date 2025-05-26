const db = require('../config/db');

const Application = {
  create: (data, cb) => {
    db.query('INSERT INTO applications SET ?', data, cb);
  },
  getByUserId: (user_id, cb) => {
    db.query('SELECT * FROM applications WHERE user_id = ?', [user_id], cb);
  },
  getAll: (cb) => {
    db.query(`
      SELECT a.*, u.name AS university_name, m.name AS major_name, c.code AS combination_code
      FROM applications a
      JOIN universities u ON a.university_id = u.id
      JOIN majors m ON a.major_id = m.id
      JOIN combinations c ON a.combination_id = c.id
      ORDER BY a.created_at DESC
    `, cb);
  },
  updateStatus: (id, status, cb) => {
    db.query('UPDATE applications SET status = ? WHERE id = ?', [status, id], cb);
  },
  getById: (id, cb) => {
    db.query('SELECT * FROM applications WHERE id = ?', [id], cb);
  },

    countByUniversity: (cb) => {
    db.query(`
      SELECT u.name AS university, COUNT(*) AS total
      FROM applications a
      JOIN universities u ON a.university_id = u.id
      GROUP BY a.university_id
    `, cb);
  },

  countByMajor: (cb) => {
    db.query(`
      SELECT m.name AS major, COUNT(*) AS total
      FROM applications a
      JOIN majors m ON a.major_id = m.id
      GROUP BY a.major_id
    `, cb);
  },

  countByStatus: (cb) => {
    db.query(`
      SELECT status, COUNT(*) AS total
      FROM applications
      GROUP BY status
    `, cb);
  }
};




module.exports = Application;
