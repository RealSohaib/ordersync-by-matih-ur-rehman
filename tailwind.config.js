/** @type {import('tailwindcss').Config} */
export default{
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        'matte-red':'#BD0231',
        'matte-black':'#28282B',
        'matte-yellow':'#fed000',
      }
    },
  },
  plugins: [],
};
