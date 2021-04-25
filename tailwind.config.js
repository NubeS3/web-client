module.exports = {
  purge: [],
  // purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'light-blue': "#006db3",
        'ocean-blue': "#004383",
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
