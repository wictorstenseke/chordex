import { beforeEach, describe, expect, it, vi } from "vitest";

import { createSong, deleteSong, getSong, getSongsForUser, updateSong } from "./songs";

describe("songs lib", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("crypto", {
      randomUUID: vi.fn(() => "00000000-0000-0000-0000-000000000001"),
    });
  });

  describe("createSong", () => {
    it("should create a song and return its id", async () => {
      const id = await createSong("uid", { title: "Song", content: "Content" });

      expect(id).toBe("00000000-0000-0000-0000-000000000001");
      const stored = JSON.parse(localStorage.getItem("chordex-songs")!);
      expect(stored).toHaveLength(1);
      expect(stored[0].title).toBe("Song");
      expect(stored[0].ownerId).toBe("uid");
      expect(stored[0].content).toBe("Content");
      expect(stored[0].visibility).toBe("private");
    });

    it("should store optional fields when provided", async () => {
      await createSong("uid", {
        title: "Song",
        content: "Content",
        artist: "Artist",
        key: "C",
        capo: 2,
        tempo: 120,
        tags: ["worship"],
        visibility: "unlisted",
      });

      const stored = JSON.parse(localStorage.getItem("chordex-songs")!);
      expect(stored[0].artist).toBe("Artist");
      expect(stored[0].key).toBe("C");
      expect(stored[0].capo).toBe(2);
      expect(stored[0].tempo).toBe(120);
      expect(stored[0].tags).toEqual(["worship"]);
      expect(stored[0].visibility).toBe("unlisted");
    });
  });

  describe("getSongsForUser", () => {
    it("should return empty array when no songs exist", async () => {
      const result = await getSongsForUser("uid");

      expect(result).toEqual([]);
    });

    it("should return only songs belonging to the user", async () => {
      await createSong("uid-1", { title: "Song A", content: "" });
      vi.mocked(crypto.randomUUID).mockReturnValueOnce("00000000-0000-0000-0000-000000000002");
      await createSong("uid-2", { title: "Song B", content: "" });

      const result = await getSongsForUser("uid-1");

      expect(result).toHaveLength(1);
      expect(result[0].title).toBe("Song A");
    });

    it("should return songs sorted by updatedAt descending", async () => {
      vi.mocked(crypto.randomUUID).mockReturnValueOnce("00000000-0000-0000-0000-00000000000a");
      const dateOlder = new Date("2024-01-01T00:00:00Z");
      const dateNewer = new Date("2024-06-01T00:00:00Z");

      vi.spyOn(Date.prototype, "toISOString")
        .mockReturnValueOnce(dateOlder.toISOString())
        .mockReturnValueOnce(dateOlder.toISOString());
      await createSong("uid", { title: "Older", content: "" });

      vi.spyOn(Date.prototype, "toISOString")
        .mockReturnValueOnce(dateNewer.toISOString())
        .mockReturnValueOnce(dateNewer.toISOString());
      vi.mocked(crypto.randomUUID).mockReturnValueOnce("00000000-0000-0000-0000-00000000000b");
      await createSong("uid", { title: "Newer", content: "" });

      vi.restoreAllMocks();

      const result = await getSongsForUser("uid");

      expect(result[0].title).toBe("Newer");
      expect(result[1].title).toBe("Older");
    });
  });

  describe("getSong", () => {
    it("should return null when song does not exist", async () => {
      const result = await getSong("nonexistent");

      expect(result).toBeNull();
    });

    it("should return the song when it exists", async () => {
      await createSong("uid", { title: "My Song", content: "Lyrics" });

      const result = await getSong("00000000-0000-0000-0000-000000000001");

      expect(result).not.toBeNull();
      expect(result!.id).toBe("00000000-0000-0000-0000-000000000001");
      expect(result!.title).toBe("My Song");
      expect(result!.content).toBe("Lyrics");
      expect(result!.createdAt).toBeInstanceOf(Date);
      expect(result!.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe("deleteSong", () => {
    it("should remove the song from storage", async () => {
      await createSong("uid", { title: "To Delete", content: "" });

      await deleteSong("00000000-0000-0000-0000-000000000001");

      const result = await getSong("00000000-0000-0000-0000-000000000001");
      expect(result).toBeNull();
    });

    it("should not affect other songs", async () => {
      vi.mocked(crypto.randomUUID).mockReturnValueOnce("00000000-0000-0000-0000-00000000aaa1");
      await createSong("uid", { title: "Keep", content: "" });
      vi.mocked(crypto.randomUUID).mockReturnValueOnce("00000000-0000-0000-0000-00000000bbb2");
      await createSong("uid", { title: "Delete", content: "" });

      await deleteSong("00000000-0000-0000-0000-00000000bbb2");

      const songs = await getSongsForUser("uid");
      expect(songs).toHaveLength(1);
      expect(songs[0].title).toBe("Keep");
    });
  });

  describe("updateSong", () => {
    it("should update a song's fields", async () => {
      await createSong("uid", { title: "Original", content: "Old content" });

      await updateSong("00000000-0000-0000-0000-000000000001", {
        title: "Updated",
        content: "New content",
        artist: "New Artist",
      });

      const result = await getSong("00000000-0000-0000-0000-000000000001");
      expect(result).not.toBeNull();
      expect(result!.title).toBe("Updated");
      expect(result!.content).toBe("New content");
      expect(result!.artist).toBe("New Artist");
    });

    it("should update updatedAt timestamp", async () => {
      await createSong("uid", { title: "Song", content: "" });

      const before = await getSong("00000000-0000-0000-0000-000000000001");
      const beforeUpdatedAt = before!.updatedAt;

      await new Promise((resolve) => setTimeout(resolve, 10));

      await updateSong("00000000-0000-0000-0000-000000000001", {
        title: "Song",
        content: "Updated",
      });

      const after = await getSong("00000000-0000-0000-0000-000000000001");
      expect(after!.updatedAt.getTime()).toBeGreaterThan(
        beforeUpdatedAt.getTime()
      );
    });

    it("should throw when song does not exist", async () => {
      await expect(
        updateSong("nonexistent", { title: "X", content: "" })
      ).rejects.toThrow("Song not found");
    });

    it("should not affect other songs", async () => {
      vi.mocked(crypto.randomUUID).mockReturnValueOnce(
        "00000000-0000-0000-0000-00000000aaa1"
      );
      await createSong("uid", { title: "Keep", content: "keep" });
      vi.mocked(crypto.randomUUID).mockReturnValueOnce(
        "00000000-0000-0000-0000-00000000bbb2"
      );
      await createSong("uid", { title: "Change", content: "change" });

      await updateSong("00000000-0000-0000-0000-00000000bbb2", {
        title: "Changed",
        content: "changed",
      });

      const kept = await getSong("00000000-0000-0000-0000-00000000aaa1");
      expect(kept!.title).toBe("Keep");
      expect(kept!.content).toBe("keep");
    });
  });
});
