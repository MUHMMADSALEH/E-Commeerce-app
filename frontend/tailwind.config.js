/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        shop: {
          purple: '#5B21B6', // Main purple color
          lightPurple: '#7C3AED',
          background: '#FFFFFF',
          text: '#111827',
          muted: '#6B7280',
          border: '#E5E7EB',
        },
        primary: {
          DEFAULT: '#5B21B6',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          foreground: '#ffffff',
        },
        background: '#ffffff',
        foreground: '#111827',
        muted: {
          DEFAULT: '#F3F4F6',
          foreground: '#6B7280',
        },
        accent: {
          DEFAULT: '#7C3AED',
          foreground: '#ffffff',
        },
        border: '#E5E7EB',
        input: '#E5E7EB',
        ring: '#5B21B6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}; 