import { type ReactNode } from "react";

import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { QueryClientProvider } from "@tanstack/react-query";

import {
  createSong,
  deleteSong,
  getSong,
  getSongsForUser,
} from "@/lib/songs";
import { createTestQueryClient } from "@/test/utils";

import {
  useCreateSongMutation,
  useDeleteSongMutation,
  useSongQuery,
  useSongsQuery,
  songKeys,
} from "./useSongs";

vi.mock("@/lib/songs", () => ({
  createSong: vi.fn(),
  deleteSong: vi.fn(),
  getSong: vi.fn(),
  getSongsForUser: vi.fn(),
}));

describe("useSongs hooks", () => {
  let queryClient: ReturnType<typeof createTestQueryClient>;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  describe("useSongsQuery", () => {
    it("should fetch songs for user successfully", async () => {
      const mockSongs = [
        { id: "1", title: "Song 1", ownerId: "uid", content: "", visibility: "private" as const, createdAt: new Date(), updatedAt: new Date() },
        { id: "2", title: "Song 2", ownerId: "uid", content: "", visibility: "private" as const, createdAt: new Date(), updatedAt: new Date() },
      ];
      vi.mocked(getSongsForUser).mockResolvedValue(mockSongs);

      const { result } = renderHook(() => useSongsQuery("uid"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockSongs);
      expect(getSongsForUser).toHaveBeenCalledWith("uid");
    });

    it("should not fetch when ownerId is undefined", () => {
      const { result } = renderHook(() => useSongsQuery(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(getSongsForUser).not.toHaveBeenCalled();
    });
  });

  describe("useSongQuery", () => {
    it("should fetch a single song successfully", async () => {
      const mockSong = {
        id: "song-1",
        title: "Test Song",
        ownerId: "uid",
        content: "[Verse 1]\nLyrics",
        visibility: "private" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      vi.mocked(getSong).mockResolvedValue(mockSong);

      const { result } = renderHook(() => useSongQuery("song-1"), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toEqual(mockSong);
      expect(getSong).toHaveBeenCalledWith("song-1");
    });

    it("should not fetch when songId is undefined", () => {
      const { result } = renderHook(() => useSongQuery(undefined), {
        wrapper: createWrapper(),
      });

      expect(result.current.isPending).toBe(true);
      expect(getSong).not.toHaveBeenCalled();
    });
  });

  describe("useCreateSongMutation", () => {
    it("should create a song and invalidate list cache", async () => {
      const input = { title: "New Song", content: "Content" };
      vi.mocked(createSong).mockResolvedValue("new-song-id");

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useCreateSongMutation("uid"), {
        wrapper: createWrapper(),
      });

      result.current.mutate(input);

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(createSong).toHaveBeenCalledWith("uid", input);
      expect(result.current.data).toBe("new-song-id");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: songKeys.list("uid"),
      });
    });
  });

  describe("useDeleteSongMutation", () => {
    it("should delete a song and invalidate list cache", async () => {
      vi.mocked(deleteSong).mockResolvedValue(undefined);

      const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

      const { result } = renderHook(() => useDeleteSongMutation("uid"), {
        wrapper: createWrapper(),
      });

      result.current.mutate("song-to-delete");

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(deleteSong).toHaveBeenCalledWith("song-to-delete");
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: songKeys.list("uid"),
      });
    });
  });

  describe("songKeys", () => {
    it("should generate correct query keys", () => {
      expect(songKeys.all).toEqual(["songs"]);
      expect(songKeys.list("uid")).toEqual(["songs", "list", "uid"]);
      expect(songKeys.detail("song-1")).toEqual(["songs", "detail", "song-1"]);
    });
  });
});
