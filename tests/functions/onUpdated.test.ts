import { getFirestore } from "firebase-admin/firestore";
import type { FeaturesList } from "firebase-functions-test/lib/features";
import logger from "firebase-functions/logger";
import { beforeAll, describe, expect, test, vi } from "vitest";
import { onUpdated } from "../../functions/src";
import { getFeaturesList } from "./setup";

const TEST_URL = "https://example.com/1";

describe("onUpdated", () => {
  let featuresList: FeaturesList;
  beforeAll(() => {
    featuresList = getFeaturesList();
  });

  test("like の総数が増加するときは何もしない", async () => {
    const db = getFirestore();
    const id = encodeURIComponent(TEST_URL);
    const afterData = {
      url: TEST_URL,
      total: 3,
      updatedAt: {
        _seconds: 1578762629,
        _nanoseconds: 828000000,
      },
    };
    await db.doc(`/summary/${id}`).set(afterData);
    const change = makeChange(
      featuresList,
      `/summary/${id}`,
      {
        url: TEST_URL,
        total: 2,
        updatedAt: {
          _seconds: 1578762627,
          _nanoseconds: 828000000,
        },
      },
      afterData,
    );

    const spy = vi.spyOn(logger, "info");

    const wrapped = featuresList.wrap(onUpdated);
    await wrapped({
      params: {
        summaryId: id,
      },
      data: change,
    });

    expect(spy).not.toBeCalled();
    const data = (await db.doc(`/summary/${id}`).get()).data();
    expect(data).toEqual(afterData);
  });

  test("like の総数が減少したときは元に戻す", async () => {
    const db = getFirestore();
    const id = encodeURIComponent(TEST_URL);
    const afterData = {
      url: TEST_URL,
      total: 2,
      updatedAt: {
        _seconds: 1578762627,
        _nanoseconds: 828000000,
      },
    };
    const beforeData = {
      url: TEST_URL,
      total: 3,
      updatedAt: {
        _seconds: 1578762629,
        _nanoseconds: 828000000,
      },
    };
    await db.doc(`/summary/${id}`).set(afterData);
    const change = makeChange(
      featuresList,
      `/summary/${id}`,
      beforeData,
      afterData,
    );

    const spy = vi.spyOn(logger, "info");

    const wrapped = featuresList.wrap(onUpdated);
    await wrapped({
      params: {
        summaryId: id,
      },
      data: change,
    });

    expect(spy).toBeCalledTimes(1);
    const data = (await db.doc(`/summary/${id}`).get()).data();
    expect(data).toEqual(beforeData);
  });
});

// biome-ignore lint/suspicious/noExplicitAny:
function makeChange<T extends { [key: string]: any }>(
  test: FeaturesList,
  path: string,
  before: T,
  after: T,
) {
  const beforeSnap = test.firestore.makeDocumentSnapshot(before, path);
  const afterSnap = test.firestore.makeDocumentSnapshot(after, path);
  return test.makeChange(beforeSnap, afterSnap);
}
