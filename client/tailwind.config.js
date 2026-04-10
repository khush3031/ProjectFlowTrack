/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6c63ff',
          hover: '#5a52e0',
        },
        danger: '#e05252',
        success: '#52c97a',
        warning: '#e0a952',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '20px',
      },
      boxShadow: {
        'premium': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'toast-in':        'toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'toast-out':       'toastOut 0.25s ease forwards',
        'progress-shrink': 'progressShrink linear forwards',
      },
      keyframes: {
        toastIn: {
          from: { opacity: '0', transform: 'translateY(-20px) scale(0.95)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        toastOut: {
          from: { opacity: '1', transform: 'translateY(0) scale(1)' },
          to:   { opacity: '0', transform: 'translateX(40px) scale(0.95)' },
        },
        progressShrink: {
          from: { transform: 'scaleX(1)' },
          to:   { transform: 'scaleX(0)' },
        },
      },
    },
  },
  plugins: [],
}
