import type { SetlistInput, SetlistWithId } from "@/types/songbook";

const STORAGE_KEY = "chordex-setlists";

interface StoredSetlist {
  id: string;
  ownerId: string;
  name: string;
  songIds: string[];
  notes?: string;
  visibility: "private" | "unlisted" | "group";
  createdAt: string;
  updatedAt: string;
}

const readAll = (): StoredSetlist[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as StoredSetlist[];
};

const writeAll = (setlists: StoredSetlist[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(setlists));
};

const toSetlistWithId = (stored: StoredSetlist): SetlistWithId => ({
  id: stored.id,
  ownerId: stored.ownerId,
  name: stored.name,
  songIds: stored.songIds,
  notes: stored.notes,
  visibility: stored.visibility,
  createdAt: new Date(stored.createdAt),
  updatedAt: new Date(stored.updatedAt),
});

export const createSetlist = async (
  ownerId: string,
  input: SetlistInput
): Promise<string> => {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  const stored: StoredSetlist = {
    id,
    ownerId,
    name: input.name.trim(),
    songIds: input.songIds ?? [],
    notes: input.notes,
    visibility: input.visibility ?? "private",
    createdAt: now,
    updatedAt: now,
  };

  const setlists = readAll();
  setlists.push(stored);
  writeAll(setlists);

  return id;
};

export const getSetlistsForUser = async (
  ownerId: string
): Promise<SetlistWithId[]> => {
  const setlists = readAll()
    .filter((s) => s.ownerId === ownerId)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

  return setlists.map(toSetlistWithId);
};

export const getSetlist = async (
  setlistId: string
): Promise<SetlistWithId | null> => {
  const found = readAll().find((s) => s.id === setlistId);
  return found ? toSetlistWithId(found) : null;
};

export const updateSetlist = async (
  setlistId: string,
  input: Partial<SetlistInput>
): Promise<void> => {
  const setlists = readAll();
  const index = setlists.findIndex((s) => s.id === setlistId);
  if (index === -1) throw new Error("Setlist not found");

  const current = setlists[index];
  setlists[index] = {
    ...current,
    ...(input.name !== undefined && { name: input.name.trim() }),
    ...(input.songIds !== undefined && { songIds: input.songIds }),
    ...(input.notes !== undefined && { notes: input.notes }),
    ...(input.visibility !== undefined && { visibility: input.visibility }),
    updatedAt: new Date().toISOString(),
  };

  writeAll(setlists);
};

export const deleteSetlist = async (setlistId: string): Promise<void> => {
  const setlists = readAll().filter((s) => s.id !== setlistId);
  writeAll(setlists);
};
