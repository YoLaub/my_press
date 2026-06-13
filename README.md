# my_press

Page web qui affiche des news RSS (agrégées par n8n dans MySQL) dans un style « une de journal papier », responsive.

```
n8n ──insert──> MySQL (table news) <──lit── Express ──sert──> Navigateur
```

## Installation

```bash
npm install
cp .env.example .env   # puis renseigne tes accès MySQL
mysql -h "$DB_HOST" -u "$DB_USER" -p "$DB_NAME" < schema.sql   # crée la table news + index
```

Variables (`.env`) : `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `PORT` (défaut 3000).

## Lancement

```bash
npm start        # http://localhost:3000
npm test         # suite de tests (API)
```

À placer derrière ton reverse-proxy (Nginx) sur le VPS. Le `.env` n'est jamais commité.

## n8n

Le flux insère une ligne par item RSS dans `news` (colonnes : `title`, `link`,
`description`, `content`, `image_url`, `source`, `published_at`). Seul `title` est requis.

## Pages

- `/` — la une : 4 articles par page, recherche par mot-clé, pagination.
- `/article.html?id=N` — feuille de lecture d'un article (titre + contenu complet).

## Sécurité

- Requêtes SQL paramétrées (aucune concaténation de valeurs).
- En-têtes HTTP durcis via `helmet`.
- Contenu échappé côté navigateur (pas d'injection HTML depuis les données RSS).
- Le navigateur ne parle jamais directement à MySQL : tout passe par l'API.
