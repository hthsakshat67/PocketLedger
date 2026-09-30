/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#F7F7F5',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#245C4A',
          hover: '#1E4D3E',
        },
        text: {
          main: '#171717',
          muted: '#6B6B6B',
        },
        border: {
          DEFAULT: '#E6E6E3',
        },
        muted: {
          background: '#F1F1EE',
        },
        status: {
          success: '#3A7D64',
          warning: '#D97706',
          danger: '#DC2626',
        }
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '14px',
      }
    },
  },
  plugins: [],
}
