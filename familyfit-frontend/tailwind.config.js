/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#1F5D3A',
          hover: '#174A2E',
          edge: '#143F27',
          50: '#EAF3EC',
          100: '#D5E7DA',
        },
        leaf: {
          DEFAULT: '#7CB342',
          50: '#F0F7E6',
          100: '#DDEBC8',
        },
        sun: {
          DEFAULT: '#F59E0B',
          50: '#FEF3DC',
        },
        cream: {
          DEFAULT: '#F8F6EF',
        },
        surface: {
          DEFAULT: '#FFFFFF',
        },
        charcoal: {
          DEFAULT: '#1A2E22',
        },
        muted: {
          DEFAULT: '#4F6355',
        },
        border: {
          DEFAULT: '#E3E0D3',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
