import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const imagePattern = /\.(avif|gif|jpe?g|png|webp)$/i;
const projectImagesRoot = new URL('../../public/images/projects/', import.meta.url);

export function getProjectImages(projectId: string): string[] {
  try {
    const directory = fileURLToPath(new URL(`${projectId}/`, projectImagesRoot));

    return readdirSync(directory, { withFileTypes: true })
      .filter((entry) => entry.isFile() && imagePattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((fileName) => `/images/projects/${projectId}/${fileName}`);
  } catch {
    return [];
  }
}
