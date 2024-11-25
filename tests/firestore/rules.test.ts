import {
  type RulesTestContext,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import type { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { Timestamp } from "firebase/firestore";
import { beforeAll, describe, test } from "vitest";
import { init } from "./setup";

describe("firestore.rules", () => {
  let testEnv: RulesTestEnvironment;
  let db: ReturnType<RulesTestContext["firestore"]>;

  beforeAll(async () => {
    testEnv = await init("demo-firestore");
    db = testEnv.unauthenticatedContext().firestore();
  });

  test("sample test", async () => {
    await assertSucceeds(
      db.collection("/likes").add({
        url: "https://example.com/1",
        createdAt: Timestamp.now(),
      }),
    );
  });
});
