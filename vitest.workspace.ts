import { defineConfig, defineWorkspace } from "vitest/config";

export default defineWorkspace([
  defineConfig({
    test: {
      name: "firestore",
      include: ["tests/firestore/**/*.test.ts"],
      setupFiles: ["tests/firestore/setup.ts"],
    },
  }),
  defineConfig({
    test: {
      name: "functions",
      include: ["tests/functions/**/*.test.ts"],
      setupFiles: ["tests/functions/setup.ts"],
      fileParallelism: false,
      poolOptions: {
        threads: {
          singleThread: true,
        },
      },
    },
  }),
]);
