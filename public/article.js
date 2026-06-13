const sheet = document.getElementById('sheet');

function escapeHtml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

function paragraphs(text) {
  return String(text || '')
    .split(/\n{2,}|\r\n\r\n/)
    .map(p => p.trim())
    .filter(Boolean)
    .map(p => `<p>${escapeHtml(p)}</p>`)
    .join('') || '<p></p>';
}

async function load() {
  const id = new URLSearchParams(location.search).get('id');
  if (!id || !/^\d+$/.test(id)) {
    sheet.innerHTML = '<p class="empty">Article introuvable.</p>';
    return;
  }
  try {
    const res = await fetch(`/api/news/${id}`);
    if (res.status === 404) { sheet.innerHTML = '<p class="empty">Article introuvable.</p>'; return; }
    if (!res.ok) throw new Error('http');
    const a = await res.json();

    const meta = [a.source, formatDate(a.published_at)].filter(Boolean).join(' · ');
    sheet.innerHTML =
      `${a.source ? `<div class="kicker">${escapeHtml(a.source)}</div>` : ''}` +
      `<h1>${escapeHtml(a.title)}</h1>` +
      `${meta ? `<div class="byline">${escapeHtml(meta)}</div>` : ''}` +
      `${a.image_url ? `<img src="${escapeHtml(a.image_url)}" alt="">` : ''}` +
      `<div class="body">${paragraphs(a.content || a.description)}</div>` +
      `${a.link ? `<a class="origin" href="${escapeHtml(a.link)}" target="_blank" rel="noopener">Voir la source originale →</a>` : ''}`;
    document.title = `My Press — ${a.title}`;
  } catch (e) {
    sheet.innerHTML = '<p class="empty">Impossible de charger l\'article.</p>';
  }
}

load();
