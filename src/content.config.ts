import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    stack: z.array(z.string()),
    order: z.number(),
    url: z.string().url().optional(),
    urlLabel: z.string().optional(),
  }),
});

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    readingTime: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = { projects, blog };
