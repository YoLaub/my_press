const newsEl = document.getElementById('news');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const form = document.getElementById('search-form');
const input = document.getElementById('search-input');

let page = 1;
let totalPages = 0;
let q = '';

document.getElementById('masthead-date').textContent =
  new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderArticle(a) {
  const el = document.createElement('a');
  el.className = 'article';
  el.href = `article.html?id=${encodeURIComponent(a.id)}`;
  el.innerHTML =
    `${a.source ? `<div class="kicker">${escapeHtml(a.source)}</div>` : ''}` +
    `<h2>${escapeHtml(a.title)}</h2>` +
    `<p>${escapeHtml((a.description || '').slice(0, 220))}</p>`;
  return el;
}

async function load() {
  newsEl.innerHTML = '';
  try {
    const res = await fetch(`/api/news?page=${page}&q=${encodeURIComponent(q)}`);
    if (!res.ok) throw new Error('http');
    const data = await res.json();
    totalPages = data.totalPages;

    if (data.items.length === 0) {
      newsEl.innerHTML = `<p class="empty">${q ? 'Aucun résultat.' : 'Aucune news pour le moment.'}</p>`;
    } else {
      data.items.forEach(a => newsEl.appendChild(renderArticle(a)));
    }
    pageInfo.textContent = totalPages ? `Page ${data.page} / ${totalPages}` : '';
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;
  } catch (e) {
    newsEl.innerHTML = '<p class="empty">Impossible de charger les news.</p>';
  }
}

prevBtn.addEventListener('click', () => { if (page > 1) { page--; load(); } });
nextBtn.addEventListener('click', () => { if (page < totalPages) { page++; load(); } });
form.addEventListener('submit', (e) => { e.preventDefault(); q = input.value.trim(); page = 1; load(); });

load();
