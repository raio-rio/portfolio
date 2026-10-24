// Minimal SEO/content sanity check — no dependencies.
// Usage: npm run check:seo
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const errors = [];
const warnings = [];

const readDir = (dir) => {
  try {
    return readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch {
    return [];
  }
};

// Very small frontmatter parser: reads key: value lines between --- fences.
const parseFrontmatter = (file) => {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    data[key] = value;
  }
  return data;
};

const checkImageRefs = (file, bodyStart) => {
  const raw = readFileSync(file, 'utf8');
  const refs = [...raw.matchAll(/!\[.*?\]\((\/images\/[^)]+)\)/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (!existsSync(join(root, 'public', ref))) {
      errors.push(`${file}: missing image ${ref}`);
    }
  }
  void bodyStart;
};

// --- Blog checks ---
for (const file of readDir(join(root, 'src/content/blog'))) {
  const full = join(root, 'src/content/blog', file);
  const fm = parseFrontmatter(full);
  for (const key of ['title', 'description', 'date', 'readingTime']) {
    if (!fm[key]) errors.push(`blog/${file}: missing frontmatter "${key}"`);
  }
  if (fm.date && Number.isNaN(Date.parse(`${fm.date}T12:00:00Z`))) {
    errors.push(`blog/${file}: unparseable date "${fm.date}"`);
  }
  if (fm.description && fm.description.length > 160) {
    warnings.push(`blog/${file}: description is ${fm.description.length} chars (aim <= 160)`);
  }
  checkImageRefs(full);
}

// --- Project checks ---
for (const file of readDir(join(root, 'src/content/projects'))) {
  const full = join(root, 'src/content/projects', file);
  const fm = parseFrontmatter(full);
  for (const key of ['title', 'tagline', 'order']) {
    if (!fm[key]) errors.push(`projects/${file}: missing frontmatter "${key}"`);
  }
  checkImageRefs(full);
}

// --- Site-level checks ---
for (const probe of ['/images/pic.jpg', '/favicon.svg', '/site.webmanifest', '/ESPINOSA_RESUME.pdf']) {
  if (!existsSync(join(root, 'public', probe))) {
    warnings.push(`public${probe} is missing (referenced by layout/manifest)`);
  }
}
const layout = readFileSync(join(root, 'src/layouts/Layout.astro'), 'utf8');
for (const needle of ['rel="canonical"', 'og:title', 'twitter:card', 'application/rss+xml', 'site.webmanifest']) {
  if (!layout.includes(needle)) warnings.push(`Layout.astro is missing "${needle}"`);
}

if (warnings.length > 0) {
  console.log('SEO warnings:');
  for (const w of warnings) console.log(`  - ${w}`);
}
if (errors.length > 0) {
  console.error('SEO errors:');
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}
console.log(errors.length === 0 && warnings.length === 0 ? 'SEO check passed with no findings.' : 'SEO check passed with warnings only.');
