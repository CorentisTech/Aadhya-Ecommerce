/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          warmWhite: "#FFFFFF",
          softBeige: "#F4EFE9",
          espresso: "#2C2522",
          warmGray: "#756E69",
          white: "#FFFFFF",
          dustyRose: "#C98F91",
          blush: "#F3DFDF",
          border: "#E8E1DA",
          success: "#71836C",
          sale: "#B96F72",
          // Numismatics accents:
          antiqueBronze: "#9A7955",
          gold: "#B89A67",
        }
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Playfair Display", "serif"],
        sans: ["Inter", "Manrope", "sans-serif"],
      },
      animation: {
        'marquee-slow': 'marquee 40s linear infinite',
        'marquee-reverse-slow': 'marquee-rev 40s linear infinite',
        'spin-slow': 'spin 15s linear infinite',
        'spin-coin': 'spinY 8s linear infinite',
        'spin-coin-fast': 'spinY 3s linear infinite',
        'float-slow': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out infinite 3s',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        spinY: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(360deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
