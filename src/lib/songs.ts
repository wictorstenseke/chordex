import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type DocumentData,
  type Timestamp,
} from "firebase/firestore";

import { getFirestoreDb } from "@/lib/firebase";

import type { Song, SongInput, SongWithId } from "@/types/songbook";

const SONGS_COLLECTION = "songs";

const toSongWithId = (id: string, data: DocumentData): SongWithId => ({
  id,
  ownerId: data.ownerId,
  title: data.title,
  artist: data.artist,
  key: data.key,
  capo: data.capo,
  tempo: data.tempo,
  tags: data.tags,
  content: data.content ?? "",
  visibility: data.visibility ?? "private",
  source: data.source
    ? {
        songId: data.source.songId,
        ownerId: data.source.ownerId,
        importedAt: (data.source.importedAt as Timestamp)?.toDate?.() ?? new Date(),
      }
    : undefined,
  createdAt: (data.createdAt as Timestamp)?.toDate?.() ?? new Date(),
  updatedAt: (data.updatedAt as Timestamp)?.toDate?.() ?? new Date(),
});

export const createSong = async (
  ownerId: string,
  input: SongInput
): Promise<string> => {
  const db = getFirestoreDb();
  if (!db) {
    throw new Error("Firestore not configured");
  }

  const songData: Omit<Song, "createdAt" | "updatedAt"> & {
    createdAt: ReturnType<typeof serverTimestamp>;
    updatedAt: ReturnType<typeof serverTimestamp>;
  } = {
    ownerId,
    title: input.title,
    content: input.content,
    visibility: input.visibility ?? "private",
    artist: input.artist,
    key: input.key,
    capo: input.capo,
    tempo: input.tempo,
    tags: input.tags,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const ref = await addDoc(collection(db, SONGS_COLLECTION), songData);
  return ref.id;
};

export const getSongsForUser = async (
  ownerId: string
): Promise<SongWithId[]> => {
  const db = getFirestoreDb();
  if (!db) {
    return [];
  }

  const q = query(
    collection(db, SONGS_COLLECTION),
    where("ownerId", "==", ownerId),
    orderBy("updatedAt", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toSongWithId(d.id, d.data()));
};

export const getSong = async (
  songId: string
): Promise<SongWithId | null> => {
  const db = getFirestoreDb();
  if (!db) {
    return null;
  }

  const ref = doc(db, SONGS_COLLECTION, songId);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    return null;
  }
  return toSongWithId(snap.id, snap.data());
};
