import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      // By providing a babel config, we might influence how the
      // react-refresh transform is applied, which could be the
      // source of the linting conflict.
      babel: {},
    }),
  ],
  server: { port: 5173 },
});
