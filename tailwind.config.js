/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        foundation: {
          50: "#FFF8F0",
          100: "#FFF0E6",
          200: "#FFE0CC",
          300: "#FFCC99",
          400: "#FFB866",
          500: "#E87524",
          600: "#C95616",
          700: "#A84314",
          800: "#8A3512",
          900: "#123C2A",
          950: "#0C291A",
        },
        gold: {
          50: "#FFFBEB",
          100: "#FEF3C0",
          200: "#FDE689",
          300: "#FCD34D",
          400: "#FBC054",
          500: "#F28C28",
          600: "#D9A036",
          700: "#B68B29",
          800: "#91721D",
          900: "#715B14",
        },
        neutral: {
          50: "#FAFAF8",
          100: "#F8F7F5",
          200: "#F1EFE9",
          300: "#E5E0D8",
          400: "#D1CBC0",
          500: "#B5ACA3",
          600: "#8C8376",
          700: "#6B6558",
          800: "#4A453A",
          900: "#17211B",
          950: "#0D120E",
        },
        sand: {
          50: "#FFFFFF",
          100: "#FFF8F0",
          200: "#FFF1E6",
          300: "#FFE5CC",
          400: "#FFD8B2",
          500: "#FFCC99",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans", "system-ui", "sans-serif"],
        display: ["Plus Jakarta Sans", "Poppins", "ui-sans", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.6s ease-out",
        "pulse-gentle": "pulseGentle 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGentle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      borderRadius: {
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
