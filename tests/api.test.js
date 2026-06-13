const request = require('supertest');
const createApp = require('../server');

function makeDb(overrides = {}) {
  return {
    getNews: jest.fn(),
    getNewsById: jest.fn(),
    ...overrides,
  };
}

describe('GET /api/news', () => {
  test('returns paginated items with totals', async () => {
    const db = makeDb({
      getNews: jest.fn().mockResolvedValue({
        items: [{ id: 1, title: 'A' }],
        total: 9,
      }),
    });
    const app = createApp(db);

    const res = await request(app).get('/api/news?page=2&q=ai');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      items: [{ id: 1, title: 'A' }],
      page: 2,
      total: 9,
      totalPages: 3,
    });
    expect(db.getNews).toHaveBeenCalledWith({ page: 2, q: 'ai', pageSize: 4 });
  });

  test('defaults invalid page to 1 and empty q', async () => {
    const db = makeDb({
      getNews: jest.fn().mockResolvedValue({ items: [], total: 0 }),
    });
    const app = createApp(db);

    const res = await request(app).get('/api/news?page=-3');

    expect(res.status).toBe(200);
    expect(res.body.page).toBe(1);
    expect(res.body.totalPages).toBe(0);
    expect(db.getNews).toHaveBeenCalledWith({ page: 1, q: '', pageSize: 4 });
  });

  test('returns 500 when db fails', async () => {
    const db = makeDb({
      getNews: jest.fn().mockRejectedValue(new Error('boom')),
    });
    const app = createApp(db);

    const res = await request(app).get('/api/news');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('error');
  });
});
