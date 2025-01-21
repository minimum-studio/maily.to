import type { Config } from 'tailwindcss';
import sharedConfig from 'tailwind-config/tailwind.config';

const config: Pick<Config, 'prefix' | 'presets' | 'corePlugins' | 'theme'> = {
  prefix: 'mly-',
  corePlugins: {
    // Disable preflight to avoid Tailwind overriding the styles of the editor.
    preflight: false,
  },
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1e1e1e',
            '--tw-prose-headings': '#1e1e1e',
            '--tw-prose-bold': '#1e1e1e',
            '--tw-prose-bullets': '#1e1e1e',
            '--tw-prose-code': '#1e1e1e',
            '--tw-prose-links': '#2563eb',
            '--tw-prose-links-hover': '#1e40af',
          },
        },
      },
    },
  },
  presets: [sharedConfig],
};

export default config;
