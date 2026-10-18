import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['Personal', 'Work']),
    tagline: z.string(),
    stack: z.array(z.string()),
    impact: z.string().optional(),
    order: z.number(),
    url: z.string().url().optional(),
    urlLabel: z.string().optional(),
  }),
});

export const collections = { projects };
