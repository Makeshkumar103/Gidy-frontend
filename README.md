# Gidy Audit Shield — Frontend Dashboard

A **React single-page application** built with **Vite** that provides a rich, interactive dashboard for viewing, filtering, and analyzing system audit logs. The frontend for the Gidy Audit Shield — a full-stack SecOps investigation tool.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI component library |
| **Vite** | Build tool & dev server (HMR) |
| **lucide-react** | SVG icon library |
| **CSS (custom)** | Dark theme with glassmorphism design |
| **ESLint** | Code quality & linting |

---

## Features

### Dashboard Overview
- **4 stat cards** — Total Logs, Unresolved Logs, Critical & High, Active Regions
- **Donut chart** — severity distribution with percentage legend
- **Bar chart** — top 5 most frequent actions

### Log Exploration
- **Search bar** with debounced (300ms) auto-fetch
- **6 multi-select filter dropdowns** — severity, status, region, action, role, resource type (populated with dynamic counts from the API)
- **Sortable data table** — click any column header to sort (actor, action, region, severity, status, timestamp)
- **Configurable page size** — 25 / 50 / 100 / 200 / 500 rows per page
- **Pagination** — first / prev / next / last with page number navigation

### Inspection & Bulk Upload
- **Log Inspector** — slide-in detail drawer showing full log metadata + raw JSON with copy-to-clipboard
- **Bulk Upload** — drag-and-drop modal for ingesting JSON audit log files with progress tracking

### UX Highlights
- Dark theme with glassmorphism (backdrop filters, semi-transparent panels)
- Responsive layout (CSS Grid + Flexbox)
- Loading spinners, empty-state onboarding prompts, and error alert banners

---

## Getting Started

```bash
cd Gidy-frontend
npm install
npm run dev     # starts on http://localhost:5173 with HMR
npm run build   # production build
npm run preview # preview production build
```

Make sure the **backend API** is running on `http://localhost:5000` for full functionality.

---

## Project Context

This is the frontend component of the **Gidy Audit Shield Dashboard** — a portfolio project demonstrating modern React development patterns including hooks-based state management, debounced data fetching, component composition, interactive data visualization, and polished UI styling.
