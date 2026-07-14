import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Blog posts as Markdown in src/content/blog. `_`-prefixed files are ignored
// (e.g. _template.md). `cover` is a public path (/images/...) so CMS-uploaded
// covers work without astro:assets.
const blog = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/blog' }),
  schema: () =>
    z.object({
      title: z.string(),
      description: z.string(),
      cover: z.string(),
      coverAlt: z.string().optional(),
      pubDate: z.coerce.date(),
      author: z.string().default('Team'),
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
