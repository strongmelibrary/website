/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      height: {
        "screen/2": "50vh",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
