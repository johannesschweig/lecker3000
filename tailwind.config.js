/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /bg-(amber|blue|cyan|emerald|fuchsia|green|indigo|lime|orange|pink|purple|red|rose|sky|teal|violet|yellow)-(200|300)/, // Add your colors here
      variants: ['hover', 'active'],
    },
  ],
  theme: {
    extend: {},
    fontFamily: {
      'sans': "League Spartan",
    }
  },
  plugins: [],
}

