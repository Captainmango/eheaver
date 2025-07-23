import { defineCollection } from 'astro:content';
import { mediumLoader } from '@ykocaman/astro-medium-loader';

const medium = defineCollection({
  loader: mediumLoader({
    username: 'edward-heaver',
    storage: {
      enabled: process.env.NODE_ENV !== "production",
      path: '.astro/storage/medium'
    }
  })
});

export const collections = { medium };