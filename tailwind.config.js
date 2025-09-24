/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Block B Brand Colors
        blockb: {
          // Dark backgrounds
          dark: "#1a1a1a",
          charcoal: "#2d2d2d",
          slate: "#3a3a3a",

          // Primary orange
          orange: {
            50: "#fff7ed",
            100: "#ffedd5",
            200: "#fed7aa",
            300: "#fdba74",
            400: "#fb923c",
            500: "#FF7A00", // Main Block B orange
            600: "#ea580c",
            700: "#c2410c",
            800: "#9a3412",
            900: "#7c2d12",
          },

          // Accent yellow/gold
          gold: {
            50: "#fefce8",
            100: "#fef9c3",
            200: "#fef08a",
            300: "#fde047",
            400: "#facc15",
            500: "#FFD700", // Block B gold
            600: "#ca8a04",
            700: "#a16207",
            800: "#854d0e",
            900: "#713f12",
          },

          // Textured whites
          cream: "#fdfcfc",
          white: "#ffffff",
          "white-texture": "#f8f8f8",
        },
      },
      fontFamily: {
        blockb: ["Arial Black", "Helvetica", "sans-serif"],
        "blockb-body": ["Arial", "Helvetica", "sans-serif"],
      },
      boxShadow: {
        blockb: "0 4px 20px rgba(255, 122, 0, 0.2)",
        "blockb-lg": "0 8px 30px rgba(255, 122, 0, 0.3)",
        gold: "0 4px 20px rgba(255, 215, 0, 0.2)",
        dark: "0 4px 20px rgba(0, 0, 0, 0.4)",
      },
      animation: {
        glow: "glow 2s ease-in-out infinite alternate",
        "pulse-orange": "pulse-orange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "bounce-subtle": "bounce-subtle 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        sizzle: "sizzle 0.8s ease-in-out infinite",
        "neon-flicker": "neon-flicker 2s ease-in-out infinite alternate",
        "street-pulse": "street-pulse 3s ease-in-out infinite",
      },
      backgroundImage: {
        "blockb-gradient": "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        "blockb-orange": "linear-gradient(135deg, #FF7A00 0%, #ea580c 100%)",
        "blockb-gold": "linear-gradient(135deg, #FFD700 0%, #facc15 100%)",
      },
    },
  },
  plugins: [],
};
