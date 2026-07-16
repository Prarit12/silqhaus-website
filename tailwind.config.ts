import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./client/index.html",
    "./client/src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-manrope)",
          "Manrope",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        // All legacy font tokens now resolve to Manrope so existing
        // font-poppins / font-gilroy / font-cormorant classes stay valid.
        gilroy: ["var(--font-manrope)", "Manrope", "ui-sans-serif", "sans-serif"],
        poppins: ["var(--font-manrope)", "Manrope", "ui-sans-serif", "sans-serif"],
        manrope: ["var(--font-manrope)", "Manrope", "ui-sans-serif", "sans-serif"],
        "sulphur-point": [
          "var(--font-manrope)",
          "Manrope",
          "ui-sans-serif",
          "sans-serif",
        ],
        cormorant: ["var(--font-manrope)", "Manrope", "ui-sans-serif", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
        // Black Theme Color Tokens
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        snow: "var(--snow)",
        mist: "var(--mist)",
        gold: "var(--gold)",
        sand: "var(--sand)",
        line: "var(--line)",
        // Refined Dark Luxe accents
        champagne: "var(--champagne)",
        "gold-antique": "var(--gold-antique)",
        // Legacy colors for compatibility
        "brand-light": "#f8f8f8",
        "brand-warm": "#c7c0b7",
        "brand-medium": "#60615f",
        "brand-dark": "#151211",
        bronze: "#151211",
        cream: "#c7c0b7",
        sage: "#60615f",
        tan: "#c7c0b7",
        ivory: "#f8f8f8",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
