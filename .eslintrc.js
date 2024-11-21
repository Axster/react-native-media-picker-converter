module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "@react-native",
    "plugin:@typescript-eslint/recommended",
    "prettier",
  ],
  plugins: [
    "prettier",
    "@typescript-eslint",
    "sort-imports-es6-autofix",
    "import",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {
    // ESLint rules disabled in favor of TypeScript rules
    "no-undef": "off",
    "no-unused-vars": "off",
    "no-shadow": "off",
    "no-use-before-define": "off",
    "object-curly-newline": "off",
    "react-native/no-inline-styles": "off",
    quotes: "off",

    // Prettier rules
    "prettier/prettier": ["error", { endOfLine: "auto" }],

    // Import rules
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",

    // TypeScript rules enabled instead of ESLint rules
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-shadow": "error",

    // React JSX scope rule
    "react/react-in-jsx-scope": "off",
  },
};
