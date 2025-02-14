import eslint from "@workshop-graphql-rappa/eslint-config";

/** @type {import("eslint").Linter.Config} */
export default [
  ...eslint,
  {
    ignores: ["eslint.config.js", ".prettierrc.js"],
  },
];
