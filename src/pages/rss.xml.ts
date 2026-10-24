import { getCollection } from 'astro:content';

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');

export async function GET({ site }: { site?: URL }) {
  const base = site ?? new URL('https://programmingrio.top');
  const posts = (await getCollection('blog')).sort((a, b) => b.data.date.localeCompare(a.data.date));

  const items = posts
    .map((post) => {
      const url = new URL(`/blog/${post.id}/`, base).href;
      const pubDate = new Date(`${post.data.date}T12:00:00Z`).toUTCString();
      const categories = post.data.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`).join('\n');
      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.data.description)}</description>
${categories}
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Rio Espinosa — Blog</title>
    <link>${base.href}</link>
    <description>Notes on builds, technology, and AI by Rio Espinosa.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
}
