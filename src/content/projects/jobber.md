---
title: Jobber
type: Personal
tagline: Opportunity-intelligence MVP — live remote jobs, deterministic filters, 0–100 ranked fit, full cost ledger.
stack: [Next.js 16, React 19, TypeScript, Tailwind CSS, FastAPI, Supabase Postgres, Treg API, TypeSafe, Docker Compose]
impact: 4 job sources · 7-signal scoring · 0–100 ranked ledger
order: 2
---

## Overview

Jobber is an opportunity-intelligence MVP that finds live remote jobs, filters mismatches deterministically, scores fit 0–100 with typed AI judgments, and ledgers every cost and decision for inspection. It only ranks — no auto-apply.

Features:

- Live multi-source search via Treg (RemoteOK, We Work Remotely, LinkedIn, Indeed) with normalization, fingerprint dedupe, and deterministic prefilters
- Explainable ranking: 7 narrow TypeSafe judgments (5 Scores + 2 Nouls) to Python-weighted composite (30/25/20/15/10) with HIGH/REVIEW/LOW confidence lanes
- Auditability: external_calls ledger (call ID, actual cost, provider, latency), run cost caps ($1 defaults), spend-vs-budget dashboard
- Hardened backend: server-only keys, RLS with no anon access, 24h idempotency keys, pytest + ruff + typecheck suite
