import { getFirestore } from "firebase-admin/firestore";
import type { FeaturesList } from "firebase-functions-test/lib/features";
import { beforeAll, describe, expect, test } from "vitest";
import { onDeleted } from "../../functions/src";
import { getFeaturesList } from "./setup";

const TEST_URL = "https://example.com/1";

describe("onDeleted", () => {
  let featuresList: FeaturesList;
  beforeAll(() => {
    featuresList = getFeaturesList();
  });

  test("like の総数を保存できる", async () => {
    const db = getFirestore();
    const id = "l1";
    await db.collection("/likes").add({
      url: TEST_URL,
      createdAt: {
        _seconds: 1578762627,
        _nanoseconds: 828000000,
      },
    });

    const deleted = featuresList.firestore.makeDocumentSnapshot(
      {
        url: TEST_URL,
        createdAt: {
          _seconds: 1578762629,
          _nanoseconds: 828000000,
        },
      },
      `/likes/${id}`,
    );

    const wrapped = featuresList.wrap(onDeleted);
    await wrapped({
      params: {
        likeId: id,
      },
      data: deleted,
    });

    const data = (
      await db.doc(`/summary/${encodeURIComponent(TEST_URL)}`).get()
    ).data();
    expect(data).toEqual({
      url: TEST_URL,
      total: 1,
    });
  });
});
