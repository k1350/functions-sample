import { readFileSync } from "node:fs";
import {
  type RulesTestEnvironment,
  initializeTestEnvironment,
} from "@firebase/rules-unit-testing";
import { afterAll, afterEach } from "vitest";

let testEnv: RulesTestEnvironment;

export async function init(projectId: string) {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
    },
  });
  return testEnv;
}

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});
