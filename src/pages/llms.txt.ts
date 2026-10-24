import { getCollection } from 'astro:content';

export async function GET({ site }: { site?: URL }) {
  const base = site ?? new URL('https://programmingrio.top');
  const url = (path: string) => new URL(path, base).href;

  const projects = (await getCollection('projects')).sort((a, b) => a.data.order - b.data.order);
  const posts = (await getCollection('blog')).sort((a, b) => b.data.date.localeCompare(a.data.date));

  const lines = [
    '# Rio Espinosa',
    '',
    '> Full Stack Developer & AI Engineer based in Cainta, Philippines (UTC+8).',
    '',
    `- Portfolio: ${base.href}`,
    '- GitHub: https://github.com/raio-rio/',
    '- LinkedIn: https://www.linkedin.com/in/rioespinosa02/',
    '',
    '## Projects',
    '',
    ...projects.map((p) => `- [${p.data.title}](${url(`/projects/`)}): ${p.data.tagline}`),
    '',
    '## Blog',
    '',
    ...posts.map((p) => `- [${p.data.title}](${url(`/blog/${p.id}/`)}): ${p.data.description}`),
    '',
  ];

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
