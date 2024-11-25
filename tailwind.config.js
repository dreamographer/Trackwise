/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neo-black': '#000000',
        'neo-white': '#FFFFFF',
        'neo-yellow': '#F6F930',
        'neo-pink': '#FF6B6B',
        'neo-blue': '#4ECDC4',
        'neo-purple': '#9B5DE5',
        'neo-green': '#2ECC71',
      },
      fontFamily: {
        'display': ['Rubik', 'system-ui', 'sans-serif'],
        'body': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'neo': '5px 5px 0px 0px rgba(0,0,0,1)',
        'neo-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
        'neo-xl': '12px 12px 0px 0px rgba(0,0,0,1)',
      },
      borderWidth: {
        'neo': '3px',
      },
    },
  },
  plugins: [],
};
