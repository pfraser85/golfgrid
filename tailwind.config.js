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
        // Country Club Color Palette
        cream: {
          50: '#FFFEFB',
          100: '#FFFEF9',
          200: '#FFF8F0',
        },
        navy: {
          DEFAULT: '#3D5A80',
          light: '#4A5F7F',
          dark: '#2E4460',
        },
        gold: {
          DEFAULT: '#D4AF6A',
          light: '#E0C282',
          dark: '#C9A961',
        },
        warmgrey: {
          DEFAULT: '#6B6B6B',
          light: '#8B8680',
          dark: '#5A5A5A',
        },
        // Keep primary colors for backward compatibility, but map to navy
        primary: {
          50: '#FFFEFB',
          100: '#FFFEF9',
          200: '#FFF8F0',
          300: '#E0C282',
          400: '#D4AF6A',
          500: '#4A5F7F',
          600: '#3D5A80',
          700: '#2E4460',
          800: '#1F2E40',
          900: '#101820',
        },
      },
      fontFamily: {
        serif: ['Merriweather', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.06)',
        'soft-lg': '0 4px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
