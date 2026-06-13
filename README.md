# my_press

Page web qui affiche des news RSS (agrégées par n8n dans Postgres) dans un style « une de journal papier », responsive.

```
n8n ──insert──> Postgres (table news) <──lit── Express ──sert──> Navigateur
```

## Installation

```bash
npm install
cp .env.example .env   # puis renseigne tes accès Postgres
psql "$DATABASE_URL" -f schema.sql   # crée la table news + index
```

Variables (`.env`) : `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PORT` (défaut 3000).

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
- Le navigateur ne parle jamais directement à Postgres : tout passe par l'API.
