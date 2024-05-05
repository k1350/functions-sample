// NODE: import { initializeApp } from 'firebase-admin/app'; はデプロイ時エラーになる
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { error, info } from "firebase-functions/logger";
import { setGlobalOptions } from "firebase-functions/v2";
import {
  onDocumentCreated,
  onDocumentDeleted,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";

setGlobalOptions({ region: "asia-northeast1" });

// テスト時 initializeApp を複数回呼ばないようにする
if (admin.apps.length === 0) {
  admin.initializeApp();
}
const db = getFirestore();

export const onCreated = onDocumentCreated("likes/{likeId}", async (event) => {
  const data = event.data?.data();
  if (!data) {
    error("event.data.data is invalid.", event.data);
    return;
  }
  return updateSummary(data.url);
});

export const onDeleted = onDocumentDeleted("likes/{likeId}", async (event) => {
  const data = event.data?.data();
  if (!data) {
    error("event.data.data is invalid.", event.data);
    return;
  }
  return updateSummary(data.url);
});

export const onUpdated = onDocumentUpdated("summary/{summaryId}", (event) => {
  const data = event.data;
  if (!data) {
    error("event.data is invalid.");
    return;
  }
  const beforeData = data.before.data();
  const afterData = data.after.data();
  if (beforeData.total <= afterData.total) {
    return null;
  }

  info("back to previous data.");
  return db.doc(`summary/${event.params.summaryId}`).set(beforeData);
});

async function updateSummary(url: string) {
  const snapshot = await db
    .collection("/likes")
    .where("url", "==", url)
    .count()
    .get();

  return db.doc(`summary/${encodeURIComponent(url)}`).set({
    url,
    total: snapshot.data().count,
  });
}
