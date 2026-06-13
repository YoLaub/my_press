require('dotenv').config();
const path = require('path');
const express = require('express');
const helmet = require('helmet');

const PAGE_SIZE = 4;

function createApp(db) {
  const app = express();

  app.use(helmet());

  app.get('/api/news', async (req, res) => {
    let page = parseInt(req.query.page, 10);
    if (!Number.isInteger(page) || page < 1) page = 1;
    const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

    try {
      const { items, total } = await db.getNews({ page, q, pageSize: PAGE_SIZE });
      const totalPages = Math.ceil(total / PAGE_SIZE);
      res.json({ items, page, total, totalPages });
    } catch (err) {
      res.status(500).json({ error: 'Impossible de charger les news' });
    }
  });

  app.use(express.static(path.join(__dirname, 'public')));

  return app;
}

module.exports = createApp;
