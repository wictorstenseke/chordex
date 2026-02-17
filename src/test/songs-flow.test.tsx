import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { getFirebaseAuth } from "@/lib/firebase";
import {
  createSong,
  getSong,
  getSongsForUser,
} from "@/lib/songs";
import { renderAppAt } from "@/test/utils";


const mockUser = { uid: "test-uid" };

vi.mock("@/lib/firebase", () => ({
  getFirebaseAuth: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn((_auth: unknown, callback: (u: unknown) => void) => {
    callback(mockUser);
    return vi.fn();
  }),
  signInAnonymously: vi.fn(),
}));

vi.mock("@/lib/songs", () => ({
  createSong: vi.fn(),
  getSong: vi.fn(),
  getSongsForUser: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: mockUser, isLoading: false, error: null }),
}));

describe("songs flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getFirebaseAuth).mockReturnValue({} as never);
  });

  describe("songs list", () => {
    it("should render songs list with empty state when no songs", async () => {
      vi.mocked(getSongsForUser).mockResolvedValue([]);

      await renderAppAt(["/songs"]);

      await waitFor(
        () => expect(screen.getByText(/no songs yet/i)).toBeInTheDocument(),
        { timeout: 3000 }
      );
      expect(screen.getByRole("link", { name: /create first song/i })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /new song/i })).toBeInTheDocument();
    });

    it("should render song cards when songs exist", async () => {
      vi.mocked(getSongsForUser).mockResolvedValue([
        {
          id: "1",
          title: "Amazing Grace",
          artist: "John Newton",
          ownerId: "test-uid",
          content: "",
          visibility: "private",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await renderAppAt(["/songs"]);

      await waitFor(
        () => expect(screen.getByText(/amazing grace/i)).toBeInTheDocument(),
        { timeout: 3000 }
      );
      expect(screen.getByText(/john newton/i)).toBeInTheDocument();
    });
  });

  describe("create song", () => {
    it("should show create form and create song on submit", async () => {
      vi.mocked(getSongsForUser).mockResolvedValue([]);
      vi.mocked(createSong).mockResolvedValue("new-song-123");
      vi.mocked(getSong).mockImplementation((id) =>
        Promise.resolve(
          id === "new-song-123"
            ? {
                id: "new-song-123",
                title: "Test Song",
                ownerId: "test-uid",
                content: "\n",
                visibility: "private",
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            : null
        )
      );

      const user = userEvent.setup();
      const { router } = await renderAppAt(["/songs/new"]);

      await waitFor(
        () => expect(screen.getByText(/new song/i)).toBeInTheDocument(),
        { timeout: 3000 }
      );

      await user.type(
        screen.getByLabelText(/title \(required\)/i),
        "Test Song"
      );
      await user.click(screen.getByRole("button", { name: /create song/i }));

      await waitFor(() => {
        expect(createSong).toHaveBeenCalledWith("test-uid", {
          title: "Test Song",
          content: "\n",
        });
      });

      await waitFor(() => {
        expect(router.state.location.pathname).toBe("/songs/new-song-123");
      });
    });
  });

  describe("song detail", () => {
    it("should show song content when song exists", async () => {
      vi.mocked(getSong).mockResolvedValue({
        id: "song-1",
        title: "Detail Song",
        artist: "Artist Name",
        ownerId: "test-uid",
        content: "[Verse 1]\nLyrics here",
        visibility: "private",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await renderAppAt(["/songs/song-1"]);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /detail song/i })).toBeInTheDocument();
      });
      expect(screen.getByText(/artist name/i)).toBeInTheDocument();
      expect(screen.getByText(/\[Verse 1\]/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /back to songs/i })).toBeInTheDocument();
    });

    it("should show not found when song does not exist", async () => {
      vi.mocked(getSong).mockResolvedValue(null);

      await renderAppAt(["/songs/missing-song"]);

      await waitFor(() => {
        expect(screen.getByText(/song not found/i)).toBeInTheDocument();
      });
      expect(screen.getByRole("link", { name: /back to songs/i })).toBeInTheDocument();
    });
  });
});
