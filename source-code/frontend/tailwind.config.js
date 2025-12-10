/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        Popins: ["'Poppins'", "sans-serif"],
      },
      colors: {
        primary: "#319AF6",
        headerBg: "#f7f7fe",
        sideNavBg: "#2A2D3E",
        menuBg: "#2A2D3E",
        tableBg: "white",
        tableHeaderBg: "#f1f5f9",
        cardBg: "#FAFAFA",

        // E-commerce colors
        ePrimary: "#4f46e5",
      },
      container: {
        center: true,
        padding: "1rem",
      },
      screens: {
        xxs: "375px",
        xs: "425px",
        sm: "576px",

        md: "769px",

        lg: "992px",

        xl: "1200px",

        "2xl": "1400px",
        "3xl": "1900px",
      },
      fontSize: {
        xxs: ".35rem",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
