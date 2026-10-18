---
title: Jobber
type: Personal
tagline: Opportunity-intelligence MVP - evidence ledger for job search, not a generic AI matcher
stack: [Next.js 16.4, React 19.3, TypeScript 5.7, Tailwind CSS 4.3, FastAPI, Pydantic, SQLAlchemy, Supabase Postgres, Treg API, TypeSafe Jev, Docker Compose]
order: 0
---

## Overview

Jobber is an opportunity-intelligence MVP for developers and freelancers. It pulls live listings via Treg (RemoteOK, We Work Remotely, LinkedIn, Indeed), rejects mismatches with deterministic filters + dedupe, asks TypeSafe Jev 7 narrow typed questions (5 Scores + 2 Nouls), and calculates an inspectable 0-100 ranking with confidence lanes (HIGH/REVIEW/LOW). Includes cost-ledgered runs, company enrichment, and a full Next.js + FastAPI + Supabase stack.

Features:

- Live multi-source job search with budget-capped Treg calls + ExternalCall ledger
- Deterministic normalize/dedupe/prefilter before any AI spend
- Python-owned composite scoring (30/25/20/15/10 weights) with stored evidence
- Costs dashboard, run logs, profile JSON import, Settings without .env edits
