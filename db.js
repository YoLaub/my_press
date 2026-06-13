require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST,
  port: Number(process.env.PGPORT) || 5432,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
});

const ORDER = 'ORDER BY published_at DESC NULLS LAST, created_at DESC';

async function getNews({ page, q, pageSize }) {
  const offset = (page - 1) * pageSize;
  const filter = q ? 'WHERE title ILIKE $1 OR description ILIKE $1' : '';
  const baseParams = q ? [`%${q}%`] : [];

  const countSql = `SELECT COUNT(*)::int AS total FROM news ${filter}`;
  const { rows: countRows } = await pool.query(countSql, baseParams);
  const total = countRows[0].total;

  const limitIdx = baseParams.length + 1;
  const offsetIdx = baseParams.length + 2;
  const listSql =
    `SELECT id, title, link, description, image_url, source, published_at
     FROM news ${filter} ${ORDER}
     LIMIT $${limitIdx} OFFSET $${offsetIdx}`;
  const { rows: items } = await pool.query(listSql, [...baseParams, pageSize, offset]);

  return { items, total };
}

async function getNewsById(id) {
  const { rows } = await pool.query('SELECT * FROM news WHERE id = $1', [id]);
  return rows[0] || null;
}

module.exports = { getNews, getNewsById, pool };
