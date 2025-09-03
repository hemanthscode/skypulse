/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./app.js", "./src/**/*.{html,js,css}"],
  theme: {
    extend: {
      fontFamily: {
        inter: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        "neon-blue": "#00d4ff",
        "neon-purple": "#a855f7",
        "neon-pink": "#ec4899",
        "neon-green": "#10b981",
        "neon-yellow": "#f59e0b",
        "neon-cyan": "#06b6d4",
        "dark-bg": "#0a0a0a",
        "dark-card": "#1a1a1a",
        "dark-border": "#2a2a2a",
      },
      animation: {
        float: "float 8s ease-in-out infinite",
        "pulse-neon": "pulseNeon 2s ease-in-out infinite alternate",
        glow: "glow 3s ease-in-out infinite alternate",
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "slide-in": "slideIn 0.6s ease-out forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseNeon: {
          "0%": { boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(0, 212, 255, 0.6)" },
        },
        glow: {
          "0%": { textShadow: "0 0 10px rgba(255, 255, 255, 0.5)" },
          "100%": { textShadow: "0 0 20px rgba(255, 255, 255, 0.8)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
