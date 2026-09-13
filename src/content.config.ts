import { defineCollection } from 'astro:content';
import { mediumLoader } from '@ykocaman/astro-medium-loader';

const medium = defineCollection({
  loader: mediumLoader({
    username: 'edward-heaver',
    storage: {
      enabled: !import.meta.env.PROD,
      path: '.astro/storage/medium'
    }
  })
});

export const collections = { medium };