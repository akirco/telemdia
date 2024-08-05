import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        pattern: 'var(--pattern)',
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            background: '#eeeeee',
            foreground: '#0b0d19',
            primary: {
              DEFAULT: '#a32f45',
              foreground: '#ffffff',
            },
            secondary: {
              DEFAULT: '#000000',
              foreground: '#E5E5E5',
            },
          },
        },
        dark: {
          colors: {
            background: '#111418',
            foreground: '#aeb2a3',
            primary: {
              DEFAULT: '#a32f45',
              foreground: '#000000',
            },
            secondary: {
              DEFAULT: '#000000',
              foreground: '#E5E5E5',
            },
          },
        },
      },
    }),
    function ({ addVariant }: { addVariant: any }) {
      addVariant('child', '& > *');
      addVariant('child-hover', '& > *:hover');
      addVariant('last-child', '& > :last-child');
    },
  ],
};

export default config;
