---
title: Applyer Automated Job Application
type: Personal
tagline: Watches remote job boards around the clock, scores new listings against my resume, and drafts tailored applications for strong fits within minutes of posting.
stack: [Python, FastAPI, Next.js 16, React 19, TypeScript, Tailwind CSS, SQLite, Camoufox (stealth headless browser), BeautifulSoup, OpenAI-compatible LLMs, Discord webhooks, SSE streaming, Caddy, pm2]
impact: Polls every 15 min · strong fits applied within minutes, not hours
order: 1
---

## Overview

Applyer monitors remote job boards around the clock, scores new listings against my resume and preferences, and drafts tailored application messages for each match — so strong fits get a quality application within minutes of posting instead of hours of manual searching. A scheduled watcher polls listings every 15 minutes, deduplicates against known jobs, and pushes only top-scoring fresh matches to Discord with direct links. A local-rules matching engine scores each listing on skill overlap, salary normalization, recency, and employment type, with keyword allowlists and title blacklists to filter noise. One-click AI drafts are built from the full job description plus resume and profile context, with per-job style and length options and editable output. An async pipeline runner streams live progress and logs to the dashboard for every background task.
