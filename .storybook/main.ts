import type { StorybookConfig } from '@storybook/svelte-vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|svelte)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {
      docgen: false,
    },
  },
  async viteFinal(config) {
    config.plugins = config.plugins ?? [];
    config.plugins.unshift(svelte());
    config.optimizeDeps = config.optimizeDeps ?? {};
    config.optimizeDeps.force = true;
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      'svelte > axobject-query',
      'svelte > aria-query',
      'svelte > @jridgewell/remapping > @jridgewell/trace-mapping > @jridgewell/resolve-uri',
      'svelte > @jridgewell/sourcemap-codec',
      'svelte > acorn',
      'svelte > magic-string',
      'svelte > clsx',
    ];
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude ?? []),
      '@iconify/svelte',
      '@storybook/svelte',
    ];
    config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions ?? {};
    config.optimizeDeps.esbuildOptions.plugins = [
      ...(config.optimizeDeps.esbuildOptions.plugins ?? []),
      {
        name: 'storybook-svelte-external',
        setup(build) {
          build.onResolve({ filter: /\.svelte$/ }, (args) => ({
            path: args.path,
            external: true,
          }));
        },
      },
    ];
    return config;
  },
};

export default config;
