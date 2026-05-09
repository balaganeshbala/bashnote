// ─────────────────────────────────────────────────────────────
//  Firestore CRUD helpers
//  All data is scoped to the logged-in user's UID.
//  Structure: /users/{uid}/categories/{categoryId}/entries/{entryId}
// ─────────────────────────────────────────────────────────────

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";

const entriesRef = (uid, categoryId) =>
  collection(db, "users", uid, "categories", categoryId, "entries");

// ── Categories ────────────────────────────────────────────────

export async function getCategories(uid) {
  const snap = await getDocs(collection(db, "users", uid, "categories"));
  const cats = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

  // Assign order to any categories that don't have it yet
  const needsOrder = cats.filter((c) => c.order === undefined);
  if (needsOrder.length > 0) {
    const maxOrder = Math.max(...cats.filter((c) => c.order !== undefined).map((c) => c.order), -1);
    const batch = writeBatch(db);
    needsOrder.forEach((cat, i) => {
      const ref = doc(db, "users", uid, "categories", cat.id);
      const order = maxOrder + 1 + i;
      batch.update(ref, { order });
      cat.order = order;
    });
    await batch.commit();
  }

  return cats.sort((a, b) => a.order - b.order);
}

export async function addCategory(uid, name) {
  const existing = await getCategories(uid);
  const order = existing.length;
  return addDoc(collection(db, "users", uid, "categories"), {
    name,
    order,
    createdAt: serverTimestamp(),
  });
}

export async function updateCategoryOrder(uid, categories) {
  // categories: array of { id } in the desired order
  const batch = writeBatch(db);
  categories.forEach((cat, idx) => {
    const ref = doc(db, "users", uid, "categories", cat.id);
    batch.update(ref, { order: idx });
  });
  return batch.commit();
}

export async function updateCategory(uid, categoryId, name) {
  return updateDoc(doc(db, "users", uid, "categories", categoryId), { name });
}

export async function deleteCategory(uid, categoryId) {
  const entries = await getEntries(uid, categoryId);
  await Promise.all(entries.map((e) => deleteEntry(uid, categoryId, e.id)));
  return deleteDoc(doc(db, "users", uid, "categories", categoryId));
}

// ── Entries ───────────────────────────────────────────────────

export async function getEntries(uid, categoryId) {
  const q = query(entriesRef(uid, categoryId), orderBy("createdAt", "asc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addEntry(uid, categoryId, { name, fields = [] }) {
  return addDoc(entriesRef(uid, categoryId), {
    name,
    fields,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateEntry(uid, categoryId, entryId, { name, fields }) {
  return updateDoc(doc(db, "users", uid, "categories", categoryId, "entries", entryId), {
    name,
    fields,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteEntry(uid, categoryId, entryId) {
  return deleteDoc(
    doc(db, "users", uid, "categories", categoryId, "entries", entryId)
  );
}
