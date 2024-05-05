import firebaseFunctionsTest from "firebase-functions-test";
import { afterAll, afterEach, beforeAll } from "vitest";

const PROJECT_ID = "demo-functions";

const featuresList = firebaseFunctionsTest({
  projectId: PROJECT_ID,
});

export function getFeaturesList() {
  return featuresList;
}

beforeAll(() => {
  process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
});

afterAll(() => {
  featuresList.cleanup();
});

afterEach(async () => {
  await fetch(
    `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/${PROJECT_ID}/databases/(default)/documents`,
    { method: "DELETE" },
  );
});
