// eslint.config.js
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ["dist/"], // On ignore le dossier compilé
  },
  ...tseslint.configs.recommended, // On applique les règles recommandées pour TypeScript
];
