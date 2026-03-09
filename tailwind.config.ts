import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        'primary-foreground': 'var(--primary-foreground)',
        accent: 'var(--accent)',
        'accent-foreground': 'var(--accent-foreground)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: 'var(--card)',
        'card-foreground': 'var(--card-foreground)',
        muted: 'var(--muted)',
        'muted-foreground': 'var(--muted-foreground)',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        border: 'var(--border)',
        ring: 'var(--ring)',
        info: 'var(--info)',
        positive: 'var(--positive)',
        negative: 'var(--negative)'
      },
      borderRadius: {
        lg: '12px',
        md: '10px',
        sm: '8px'
      },
      maxWidth: {
        layout: '1200px'
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)'
      }
    }
  },
  plugins: []
};

export default config;
