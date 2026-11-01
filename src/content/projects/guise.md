---
title: Guise
type: Personal
tagline: Every account in one device.
stack: [Tauri, Rust, Next.js, React, TypeScript, Tailwind CSS, FastAPI, Python, SQLite, Camoufox, Playwright]
order: 0.5
url: https://joinguise.vercel.app/
urlLabel: Visit site
---

## Overview

A local profile manager that gives each account its own browser, its own IP address and its own identity on Windows. Built for people who run dozens of accounts for shops, ads, social, QA or data collection, without paying per profile.

Features:

- Isolated profiles with pinned fingerprints and one proxy each
- Record a flow once and replay it with human timing
- Runs entirely on your machine, free for personal use

Two engines behind one product: a full match Firefox build and a lighter Chrome build, chosen per profile. Fingerprints are pinned across restarts, proxy passwords stay in Windows Credential Manager, and the backend binds only to 127.0.0.1 so nothing leaves the machine. Ships as a signed Windows installer with a bundled Python sidecar. Repo: https://github.com/raio-rio/guise. Download: https://github.com/raio-rio/guise-releases/releases/latest
