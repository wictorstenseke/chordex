/**
 * Share helpers for encoding/decoding song data in URLs.
 * Used for localStorage-only sharing (no backend).
 */

export interface ShareableSong {
  title: string;
  artist?: string;
  key?: string;
  capo?: number;
  tempo?: number;
  tags?: string[];
  content: string;
  sourceSongId?: string;
  sourceOwnerId?: string;
}

export const encodeSongForShare = (song: ShareableSong): string => {
  const payload = JSON.stringify({
    title: song.title,
    artist: song.artist,
    key: song.key,
    capo: song.capo,
    tempo: song.tempo,
    tags: song.tags,
    content: song.content,
    sourceSongId: song.sourceSongId,
    sourceOwnerId: song.sourceOwnerId,
  });
  return btoa(encodeURIComponent(payload));
};

export const decodeSongFromShare = (encoded: string): ShareableSong | null => {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    if (typeof parsed.title !== "string" || typeof parsed.content !== "string") {
      return null;
    }
    return {
      title: parsed.title,
      artist: typeof parsed.artist === "string" ? parsed.artist : undefined,
      key: typeof parsed.key === "string" ? parsed.key : undefined,
      capo: typeof parsed.capo === "number" ? parsed.capo : undefined,
      tempo: typeof parsed.tempo === "number" ? parsed.tempo : undefined,
      tags: Array.isArray(parsed.tags)
        ? (parsed.tags as string[])
        : undefined,
      content: parsed.content,
      sourceSongId:
        typeof parsed.sourceSongId === "string"
          ? parsed.sourceSongId
          : undefined,
      sourceOwnerId:
        typeof parsed.sourceOwnerId === "string"
          ? parsed.sourceOwnerId
          : undefined,
    };
  } catch {
    return null;
  }
};
