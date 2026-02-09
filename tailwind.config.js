export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors:{
        "space-gray": "#86868B",
        "space-dark": "#1D1D1F",
        "gold": "#8B6F3A",
        "gold-light": "#B4956A",
        "gold-dim": "#6B5630",
        "copper": "#C67D4B",
        "rose": "#B76E79",
        "teal": "#4E8A8A",
        "emerald": "#4D8B6E",
        "silver": "#D2D2D7",
        "silver-bright": "#E8E8ED",
      },
      fontFamily:{
        dmsans: ["DM Sans", "sans-serif"],
        shippori: ["Shippori Antique B1", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      content:{
        headline_graphic: "url('/src/assets/sample-headline-graphic.svg')",
      },
      screens: {
        'xs': '480px',
        'sm': '768px',
        'md': '1060px',
      },
    },
  },
  plugins: [],
};
