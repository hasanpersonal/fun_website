# Hasan's Web

The personal site of **Imrul Hasan** — browser games, small web apps, video collections and a live
**activity report**. Hand-coded with HTML, CSS and vanilla JavaScript. No frameworks, no build step.

Live: <https://hasanpersonal.github.io/fun_website/>

---

## Pages

| File | What it is |
| --- | --- |
| `index.html` | Home — hero, headline numbers, featured projects, activity report preview |
| `activity.html` | **Activity report** — KPIs, portfolio status, project completion, weekly output, consistency map, roadmap, timeline |
| `game.html` | Arcade — searchable / filterable game grid |
| `page1.html` | Screening room — YouTube videos, embedded |
| `page2.html` | Drive video vault — thumbnail shelf linking to Google Drive |
| `pagecontact.html` | Contact — every channel in one place |
| `others/` | Standalone side pages (unchanged) |

## Structure

```
assets/
  site.css          design system: tokens, layout, components (single stylesheet)
  site.js           nav state, mobile menu, scroll reveal, count-up numbers
  charts.js         draws the donut / bars / heatmap / rings from the data file
  activity-data.js  ← the one file that holds every number on the site
  favicon.svg
```

## Updating the activity report

Everything numeric lives in `assets/activity-data.js`:

- `summary` — completed / in progress / planning / games / videos
- `status` — the donut segments and legend
- `projects` — one entry per project: `name`, `category`, `status` (`live` · `progress` · `planning`),
  `progress` (0–100), `url`, `icon` (any Font Awesome class), `accent` colour
- `weekly` — bars for the last N weeks
- `categories` — the radial meters
- `timeline` — recent activity feed

Add a project, change a percentage, bump the date — the home page and the report both follow.
The KPI cards on `index.html` / `activity.html` carry their own `data-count` value, so update those
four numbers too when the totals change.

## Local preview

No build required — serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploying

GitHub Pages serves the branch directly; every file here is static, so a push is a deploy.

## Design notes

- Ink-dark canvas with a soft aurora, hairline grid and glass cards
- Type: Space Grotesk (display) · Inter (body) · JetBrains Mono (data)
- Accent gradient: violet → cyan → emerald
- Charts are dependency-free SVG/CSS, data-driven and animated on scroll
- Responsive down to 360px, keyboard focus states, `prefers-reduced-motion` respected
