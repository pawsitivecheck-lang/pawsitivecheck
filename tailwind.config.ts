import type { Config } from "tailwindcss";

export default {
  // Dark mode is now the default - no toggle needed
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
        cosmic: {
          900: "var(--cosmic-900)",
          800: "var(--cosmic-800)",
          700: "var(--cosmic-700)",
          600: "var(--cosmic-600)",
          500: "var(--cosmic-500)",
          400: "var(--cosmic-400)",
          300: "var(--cosmic-300)",
          200: "var(--cosmic-200)",
          100: "var(--cosmic-100)",
        },
        midnight: {
          900: "var(--midnight-900)",
          800: "var(--midnight-800)",
          700: "var(--midnight-700)",
          600: "var(--midnight-600)",
          500: "var(--midnight-500)",
        },
        starlight: {
          500: "var(--starlight-500)",
          400: "var(--starlight-400)",
          300: "var(--starlight-300)",
          200: "var(--starlight-200)",
        },
        mystical: {
          green: "var(--mystical-green)",
          red: "var(--mystical-red)",
          purple: "var(--mystical-purple)",
        },
      },
      fontFamily: {
        mystical: ["var(--font-mystical)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        cosmic: ["var(--font-cosmic)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["var(--font-cosmic)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
        serif: ["ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Monaco", "Consolas", "Liberation Mono", "Courier New", "monospace"],
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
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        glow: {
          from: { boxShadow: "0 0 20px rgba(255, 215, 0, 0.3)" },
          to: { boxShadow: "0 0 30px rgba(255, 215, 0, 0.6)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        twinkle: "twinkle 2s linear infinite",
        glow: "glow 2s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
