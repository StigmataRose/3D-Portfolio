// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin"; // Import the HTML plugin

export default defineConfig([
  // Configuration for JavaScript files
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser }, // Assuming your JS runs in a browser
  },

  {
    files: ["**/*.html"],
    plugins: {
        html,
    },
    language: "html/html",
    rules: {
        "html/no-duplicate-class": "error",
    }
},
]);