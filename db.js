require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// En MySQL, ORDER BY ... DESC place les NULL en dernier (comportement par défaut).
const ORDER = 'ORDER BY published_at DESC, created_at DESC';

async function getNews({ page, q, pageSize }) {
  const offset = (page - 1) * pageSize;
  const filter = q ? 'WHERE title LIKE ? OR description LIKE ?' : '';
  const baseParams = q ? [`%${q}%`, `%${q}%`] : [];

  const countSql = `SELECT COUNT(*) AS total FROM news ${filter}`;
  const [countRows] = await pool.query(countSql, baseParams);
  const total = countRows[0].total;

  const listSql =
    `SELECT id, title, link, description, image_url, source, published_at
     FROM news ${filter} ${ORDER}
     LIMIT ? OFFSET ?`;
  const [items] = await pool.query(listSql, [...baseParams, pageSize, offset]);

  return { items, total };
}

async function getNewsById(id) {
  const [rows] = await pool.query('SELECT * FROM news WHERE id = ?', [id]);
  return rows[0] || null;
}

module.exports = { getNews, getNewsById, pool };
