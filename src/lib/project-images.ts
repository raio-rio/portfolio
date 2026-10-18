import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i;
const projectImagesRoot = resolve(process.cwd(), 'public', 'images', 'projects');

export function getProjectImages(projectId: string): string[] {
  try {
    const directory = resolve(projectImagesRoot, projectId);

    const fromDirectory = readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .slice(0, 2)
      .map((fileName) => `/images/projects/${projectId}/${fileName}`);

    if (fromDirectory.length > 0) return fromDirectory;
  } catch {
    // Fall through to the single-file snapshot convention below.
  }

  try {
    return readdirSync(projectImagesRoot, { withFileTypes: true })
      .filter((entry) => entry.isFile() && entry.name.startsWith(`${projectId}.`) && imagePattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .slice(0, 1)
      .map((fileName) => `/images/projects/${fileName}`);
  } catch {
    // No snapshot image available.
  }

  return [];
}
