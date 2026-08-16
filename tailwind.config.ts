import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: "#F3F5F8",
        border: "#E5E9EF",
        primary: "#2563EB",
        accent: "#F97316",
        foreground: "#111827",
        muted: "#6B7280",
        success: "#16A34A",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      typography: ({ theme }: { theme: (path: string) => string }) => ({
        DEFAULT: {
          css: {
            "--tw-prose-body": theme("colors.foreground"),
            "--tw-prose-headings": theme("colors.foreground"),
            "--tw-prose-links": theme("colors.primary"),
            "--tw-prose-bold": theme("colors.foreground"),
            "--tw-prose-bullets": theme("colors.border"),
            "--tw-prose-hr": theme("colors.border"),
            "--tw-prose-quotes": theme("colors.muted"),
            "--tw-prose-quote-borders": theme("colors.border"),
            "--tw-prose-captions": theme("colors.muted"),
            "--tw-prose-code": theme("colors.foreground"),
            "--tw-prose-th-borders": theme("colors.border"),
            "--tw-prose-td-borders": theme("colors.border"),
            maxWidth: "none",
            a: { fontWeight: "500", textDecoration: "none" },
            "a:hover": { textDecoration: "underline" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: {
              backgroundColor: theme("colors.surface"),
              borderRadius: "4px",
              padding: "0.15em 0.4em",
              fontWeight: "500",
            },
            pre: {
              backgroundColor: theme("colors.surface"),
              border: `1px solid ${theme("colors.border")}`,
              color: theme("colors.foreground"),
            },
            "pre code": { backgroundColor: "transparent", padding: 0 },
            img: { borderRadius: "8px" },
          },
        },
      }),
    },
  },
  plugins: [typography],
};

export default config;
