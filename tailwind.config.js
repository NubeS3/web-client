module.exports = {
  purge: [],
  // purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'light-blue': "#019BE5",
        'ocean-blue': "#006DB3",
      }
    },

  },
  variants: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    outline: false,
  },
};
