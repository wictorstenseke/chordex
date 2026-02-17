import { describe, expect, it, vi, beforeEach } from "vitest";

import { getFirestoreDb } from "@/lib/firebase";

import { createSong, getSong, getSongsForUser } from "./songs";

vi.mock("@/lib/firebase", () => ({
  getFirestoreDb: vi.fn(),
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  doc: vi.fn(),
  addDoc: vi.fn(),
  getDoc: vi.fn(),
  getDocs: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  serverTimestamp: vi.fn(() => ({ _placeholder: true })),
}));

describe("songs lib", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createSong", () => {
    it("should throw when Firestore is not configured", async () => {
      vi.mocked(getFirestoreDb).mockReturnValue(null);

      await expect(
        createSong("uid", { title: "Song", content: "Content" })
      ).rejects.toThrow("Firestore not configured");
    });
  });

  describe("getSongsForUser", () => {
    it("should return empty array when Firestore is not configured", async () => {
      vi.mocked(getFirestoreDb).mockReturnValue(null);

      const result = await getSongsForUser("uid");

      expect(result).toEqual([]);
    });
  });

  describe("getSong", () => {
    it("should return null when Firestore is not configured", async () => {
      vi.mocked(getFirestoreDb).mockReturnValue(null);

      const result = await getSong("song-1");

      expect(result).toBeNull();
    });
  });
});
