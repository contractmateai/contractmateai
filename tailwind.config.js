module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        shoika: ['Shoika', 'sans-serif'],
      },
      colors: {
        lime: '#adff00',
        'lime-2': '#bff611',
        'bg-dark': '#01040b',
        'text-muted': '#d8cccc',
        'badge-glow': 'rgba(191, 255, 60, 0.55)',
      },
    },
  },
  plugins: [],
};