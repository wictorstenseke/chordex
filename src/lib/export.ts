import JSZip from "jszip";

import { getSetlistsForUser } from "@/lib/setlists";
import { getSongsForUser } from "@/lib/songs";

import type { SongWithId } from "@/types/songbook";

const sanitizeFilename = (name: string): string =>
  name.replace(/[/\\?*:|"<>]/g, "-").trim() || "untitled";

const songToChordProContent = (song: SongWithId): string => {
  const lines: string[] = [];
  lines.push(`{title: ${song.title}}`);
  if (song.artist) lines.push(`{artist: ${song.artist}}`);
  if (song.key) lines.push(`{key: ${song.key}}`);
  if (song.capo !== undefined) lines.push(`{capo: ${song.capo}}`);
  if (song.tempo !== undefined) lines.push(`{tempo: ${song.tempo}}`);
  if (song.tags?.length) lines.push(`{tags: ${song.tags.join(", ")}}`);
  lines.push("");
  lines.push(song.content);
  return lines.join("\n");
};

/**
 * Export user's library as a downloadable ZIP file.
 * Contains /songs/<title>.cho, /setlists/<name>.json, and library.json index.
 */
export const exportLibrary = async (ownerId: string): Promise<Blob> => {
  const [songs, setlists] = await Promise.all([
    getSongsForUser(ownerId),
    getSetlistsForUser(ownerId),
  ]);

  const zip = new JSZip();
  const songsFolder = zip.folder("songs");
  const setlistsFolder = zip.folder("setlists");

  const seenFilenames = new Set<string>();
  const uniqueFilename = (base: string, ext: string): string => {
    let candidate = `${sanitizeFilename(base)}${ext}`;
    let n = 0;
    while (seenFilenames.has(candidate)) {
      n += 1;
      candidate = `${sanitizeFilename(base)}-${n}${ext}`;
    }
    seenFilenames.add(candidate);
    return candidate;
  };

  for (const song of songs) {
    const filename = uniqueFilename(song.title, ".cho");
    if (songsFolder) {
      songsFolder.file(filename, songToChordProContent(song));
    }
  }

  for (const setlist of setlists) {
    const filename = uniqueFilename(setlist.name, ".json");
    const payload = {
      name: setlist.name,
      songIds: setlist.songIds,
      notes: setlist.notes,
      createdAt: setlist.createdAt.toISOString(),
      updatedAt: setlist.updatedAt.toISOString(),
    };
    if (setlistsFolder) {
      setlistsFolder.file(filename, JSON.stringify(payload, null, 2));
    }
  }

  const libraryIndex = {
    exportedAt: new Date().toISOString(),
    songCount: songs.length,
    setlistCount: setlists.length,
    songs: songs.map((s) => ({
      id: s.id,
      title: s.title,
      artist: s.artist,
    })),
    setlists: setlists.map((s) => ({
      id: s.id,
      name: s.name,
      songCount: s.songIds.length,
    })),
  };
  zip.file("library.json", JSON.stringify(libraryIndex, null, 2));

  return zip.generateAsync({ type: "blob" });
};
