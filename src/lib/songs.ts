import type { SongInput, SongWithId } from "@/types/songbook";

const STORAGE_KEY = "chordex-songs";

interface StoredSong {
  id: string;
  ownerId: string;
  title: string;
  artist?: string;
  key?: string;
  capo?: number;
  tempo?: number;
  tags?: string[];
  content: string;
  visibility: "private" | "unlisted" | "group";
  createdAt: string;
  updatedAt: string;
}

const readAll = (): StoredSong[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as StoredSong[];
};

const writeAll = (songs: StoredSong[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(songs));
};

const toSongWithId = (stored: StoredSong): SongWithId => ({
  id: stored.id,
  ownerId: stored.ownerId,
  title: stored.title,
  artist: stored.artist,
  key: stored.key,
  capo: stored.capo,
  tempo: stored.tempo,
  tags: stored.tags,
  content: stored.content,
  visibility: stored.visibility,
  createdAt: new Date(stored.createdAt),
  updatedAt: new Date(stored.updatedAt),
});

export const createSong = async (
  ownerId: string,
  input: SongInput
): Promise<string> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const stored: StoredSong = {
    id,
    ownerId,
    title: input.title,
    content: input.content,
    visibility: input.visibility ?? "private",
    artist: input.artist,
    key: input.key,
    capo: input.capo,
    tempo: input.tempo,
    tags: input.tags,
    createdAt: now,
    updatedAt: now,
  };

  const songs = readAll();
  songs.push(stored);
  writeAll(songs);

  return id;
};

export const getSongsForUser = async (
  ownerId: string
): Promise<SongWithId[]> => {
  const songs = readAll()
    .filter((s) => s.ownerId === ownerId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  return songs.map(toSongWithId);
};

export const getSong = async (
  songId: string
): Promise<SongWithId | null> => {
  const found = readAll().find((s) => s.id === songId);
  return found ? toSongWithId(found) : null;
};

export const deleteSong = async (songId: string): Promise<void> => {
  const songs = readAll().filter((s) => s.id !== songId);
  writeAll(songs);
};
