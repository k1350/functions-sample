import {
  type RulesTestContext,
  assertFails,
  assertSucceeds,
} from "@firebase/rules-unit-testing";
import type { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { Timestamp } from "firebase/firestore";
import { beforeAll, beforeEach, describe, test } from "vitest";
import { init } from "./setup";

describe("firestore.rules", () => {
  let testEnv: RulesTestEnvironment;
  let db: ReturnType<RulesTestContext["firestore"]>;

  beforeAll(async () => {
    testEnv = await init("demo-firestore");
    db = testEnv.unauthenticatedContext().firestore();
  });

  describe("/likes/{id}", () => {
    describe("create", () => {
      describe("正常系", () => {
        test("正常な like を登録できる", async () => {
          await assertSucceeds(
            db.collection("/likes").add({
              url: "https://example.com/1",
              createdAt: Timestamp.now(),
            }),
          );
        });
      });

      describe("異常系", () => {
        test("like に created が無い場合登録できない", async () => {
          await assertFails(
            db.collection("/likes").add({
              url: "https://example.com/1",
              updatedAt: Timestamp.now(),
            }),
          );
        });
        test("like の created が timestamp でない場合登録できない", async () => {
          await assertFails(
            db.collection("/likes").add({
              url: "https://example.com/1",
              createdAt: 1,
            }),
          );
        });
        test("like に url が無い場合登録できない", async () => {
          await assertFails(
            db.collection("/likes").add({
              createdAt: Timestamp.now(),
            }),
          );
        });
        test("like の url が文字列でない場合登録できない", async () => {
          await assertFails(
            db.collection("/likes").add({
              url: 1,
              createdAt: Timestamp.now(),
            }),
          );
        });
        test("like の url がhttps://example.com から始まらない場合登録できない", async () => {
          await assertFails(
            db.collection("/likes").add({
              url: "http://example.com/1",
              createdAt: Timestamp.now(),
            }),
          );
        });
      });
    });

    describe("read, update, delete", () => {
      beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const adminDB = context.firestore();
          await adminDB.doc("/likes/l1").set({
            url: "https://example.com/1",
            createdAt: Timestamp.now(),
          });
        });
      });

      test("読み取れない", async () => {
        await assertFails(db.doc("/likes/l1").get());
      });
      test("更新できない", async () => {
        await assertFails(
          db.doc("/likes/l1").update({ createdAt: Timestamp.now() }),
        );
      });
      test("削除できない", async () => {
        await assertFails(db.doc("/likes/l1").delete());
      });
    });
  });

  describe("/summary/{id}", () => {
    describe("read", () => {
      beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const adminDB = context.firestore();
          await adminDB.doc("/summary/s1").set({
            url: "https://example.com/1",
            total: 5,
            updatedAt: Timestamp.now(),
          });
        });
      });

      test("読み取れる", async () => {
        await assertSucceeds(db.doc("/summary/s1").get());
      });
    });

    describe("create", () => {
      test("登録できない", async () => {
        await assertFails(
          db.collection("/summary").add({
            url: "https://example.com/1",
            total: 5,
            updatedAt: Timestamp.now(),
          }),
        );
      });
    });

    describe("update, delete", () => {
      beforeEach(async () => {
        await testEnv.withSecurityRulesDisabled(async (context) => {
          const adminDB = context.firestore();
          await adminDB.doc("/summary/s1").set({
            url: "https://example.com/1",
            total: 5,
            updatedAt: Timestamp.now(),
          });
        });
      });

      test("更新できない", async () => {
        await assertFails(
          db.doc("/summary/s1").update({ updatedAt: Timestamp.now() }),
        );
      });
      test("削除できない", async () => {
        await assertFails(db.doc("/summary/s1").delete());
      });
    });
  });
});
