import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i;
const projectImagesRoot = resolve(process.cwd(), 'public', 'images', 'projects');

export function getProjectImages(projectId: string): string[] {
  try {
    const directory = resolve(projectImagesRoot, projectId);

    return readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .slice(0, 2)
      .map((fileName) => `/images/projects/${projectId}/${fileName}`);
  } catch {
    return [];
  }
}
