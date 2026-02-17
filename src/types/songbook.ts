/**
 * SongBook Firestore data model types.
 * Matches schema in docs/app-req/user-stories/architecture/data-model.md
 */

/** Visibility for songs and setlists */
export type Visibility = "private" | "unlisted" | "group";

/** Source metadata for songs imported from sharing */
export interface SongSource {
  songId: string;
  ownerId: string;
  importedAt: Date;
}

/** User document in users/{uid} */
export interface User {
  displayName: string;
  createdAt: Date;
}

/** Song document in songs/{songId} */
export interface Song {
  ownerId: string;
  title: string;
  artist?: string;
  key?: string;
  capo?: number;
  tempo?: number;
  tags?: string[];
  content: string;
  visibility: Visibility;
  source?: SongSource;
  createdAt: Date;
  updatedAt: Date;
}

/** Song with document ID (for list/detail views) */
export interface SongWithId extends Song {
  id: string;
}

/** Create/update payload for songs (excludes server-managed fields) */
export interface SongInput {
  title: string;
  artist?: string;
  key?: string;
  capo?: number;
  tempo?: number;
  tags?: string[];
  content: string;
  visibility?: Visibility;
}

/** Setlist document in setlists/{setlistId} */
export interface Setlist {
  ownerId: string;
  name: string;
  songIds: string[];
  notes?: string;
  visibility: Visibility;
  createdAt: Date;
  updatedAt: Date;
}

/** Setlist with document ID */
export interface SetlistWithId extends Setlist {
  id: string;
}

/** Create/update payload for setlists */
export interface SetlistInput {
  name: string;
  songIds?: string[];
  notes?: string;
  visibility?: Visibility;
}
