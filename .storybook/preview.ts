import '../src/scss/main.scss';
import type { Preview } from '@storybook/svelte';
import { addCollection } from '@iconify/svelte';
import { icons as lucideIcons } from '@iconify-json/lucide';
import { icons as fa6BrandsIcons } from '@iconify-json/fa6-brands';

addCollection(lucideIcons);
addCollection(fa6BrandsIcons);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
