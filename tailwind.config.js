/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        command: {
          950: '#060B13',
          900: '#0B132B',
          850: '#101C3D',
          800: '#172554',
          700: '#1E3A8A',
        },
        resilience: {
          cyan: '#06B6D4',
          teal: '#14B8A6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        }
      },
    },
  },
  plugins: [],
};
