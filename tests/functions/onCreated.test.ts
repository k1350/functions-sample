import { getFirestore } from "firebase-admin/firestore";
import type { FeaturesList } from "firebase-functions-test/lib/features";
import { beforeAll, describe, expect, test } from "vitest";
import { onCreated } from "../../functions/src";
import { getFeaturesList } from "./setup";

const TEST_URL = "https://example.com/1";

describe("onCreated", () => {
  let featuresList: FeaturesList;
  beforeAll(() => {
    featuresList = getFeaturesList();
  });

  test("like の総数を保存できる", async () => {
    const db = getFirestore();
    const id = "l1";
    const newData = {
      url: TEST_URL,
      createdAt: {
        _seconds: 1578762629,
        _nanoseconds: 828000000,
      },
    };
    await Promise.all([
      db.collection("/likes").add({
        url: TEST_URL,
        createdAt: {
          _seconds: 1578762627,
          _nanoseconds: 828000000,
        },
      }),
      db.doc(`/likes/${id}`).set(newData),
    ]);

    const created = featuresList.firestore.makeDocumentSnapshot(
      newData,
      `/likes/${id}`,
    );

    const wrapped = featuresList.wrap(onCreated);
    await wrapped({
      params: {
        likeId: id,
      },
      data: created,
    });

    const data = (
      await db.doc(`/summary/${encodeURIComponent(TEST_URL)}`).get()
    ).data();
    expect(data).toEqual({
      url: TEST_URL,
      total: 2,
    });
  });
});
