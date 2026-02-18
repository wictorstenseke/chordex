import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import {
  createSong,
  deleteSong,
  getSong,
  getSongsForUser,
  updateSong,
} from "@/lib/songs";
import { renderAppAt } from "@/test/utils";


const mockUser = { uid: "test-uid" };

vi.mock("@/lib/firebase", () => ({
  getFirebaseAuth: vi.fn(() => null),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: vi.fn(),
  signInAnonymously: vi.fn(),
}));

vi.mock("@/lib/songs", () => ({
  createSong: vi.fn(),
  deleteSong: vi.fn(),
  getSong: vi.fn(),
  getSongsForUser: vi.fn(),
  updateSong: vi.fn(),
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({ user: mockUser, isLoading: false, error: null }),
}));

describe("songs flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
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
      expect(screen.getByLabelText("ChordPro preview")).toBeInTheDocument();
      expect(screen.getByText(/Lyrics here/)).toBeInTheDocument();
      expect(screen.getByRole("link", { name: /back to songs/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /delete/i })).toBeInTheDocument();
    });

    it("should show not found when song does not exist", async () => {
      vi.mocked(getSong).mockResolvedValue(null);

      await renderAppAt(["/songs/missing-song"]);

      await waitFor(() => {
        expect(screen.getByText(/song not found/i)).toBeInTheDocument();
      });
      expect(screen.getByRole("link", { name: /back to songs/i })).toBeInTheDocument();
    });

    it("should navigate to songs list after deleting a song", async () => {
      vi.mocked(getSong).mockResolvedValue({
        id: "song-del",
        title: "Delete Me",
        ownerId: "test-uid",
        content: "",
        visibility: "private",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(deleteSong).mockResolvedValue(undefined);
      vi.mocked(getSongsForUser).mockResolvedValue([]);

      const user = userEvent.setup();
      const { router } = await renderAppAt(["/songs/song-del"]);

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: /delete me/i })).toBeInTheDocument();
      });

      const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
      await user.click(deleteButtons[0]);

      await waitFor(() => {
        expect(screen.getByRole("alertdialog")).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole("button", { name: /^delete$/i })
      );

      await waitFor(() => {
        expect(deleteSong).toHaveBeenCalledWith("song-del");
      });

      await waitFor(() => {
        expect(router.state.location.pathname).toBe("/songs");
      });
    });
    it("should show edit link on song detail page", async () => {
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
      expect(screen.getByRole("link", { name: /edit/i })).toBeInTheDocument();
    });
  });

  describe("edit song", () => {
    it("should show edit form with pre-filled values", async () => {
      vi.mocked(getSong).mockResolvedValue({
        id: "song-edit-1",
        title: "My Song",
        artist: "My Artist",
        ownerId: "test-uid",
        content: "[Verse]\nLyrics",
        visibility: "private",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await renderAppAt(["/songs/song-edit-1/edit"]);

      await waitFor(() => {
        expect(screen.getByText(/edit song/i)).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText(/title \(required\)/i);
      const artistInput = screen.getByLabelText(/artist/i);
      const contentInput = screen.getByLabelText(/chordpro content/i);

      expect(titleInput).toHaveValue("My Song");
      expect(artistInput).toHaveValue("My Artist");
      expect(contentInput).toHaveValue("[Verse]\nLyrics");
    });

    it("should save changes and navigate to detail page", async () => {
      vi.mocked(getSong).mockResolvedValue({
        id: "song-edit-2",
        title: "Original Title",
        ownerId: "test-uid",
        content: "Original content",
        visibility: "private",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      vi.mocked(updateSong).mockResolvedValue(undefined);

      const user = userEvent.setup();
      const { router } = await renderAppAt(["/songs/song-edit-2/edit"]);

      await waitFor(() => {
        expect(screen.getByText(/edit song/i)).toBeInTheDocument();
      });

      const titleInput = screen.getByLabelText(/title \(required\)/i);
      await user.clear(titleInput);
      await user.type(titleInput, "Updated Title");

      await user.click(screen.getByRole("button", { name: /save changes/i }));

      await waitFor(() => {
        expect(updateSong).toHaveBeenCalledWith("song-edit-2", {
          title: "Updated Title",
          content: "Original content",
        });
      });

      await waitFor(() => {
        expect(router.state.location.pathname).toBe("/songs/song-edit-2");
      });
    });

    it("should show not found when editing nonexistent song", async () => {
      vi.mocked(getSong).mockResolvedValue(null);

      await renderAppAt(["/songs/nonexistent/edit"]);

      await waitFor(() => {
        expect(screen.getByText(/song not found/i)).toBeInTheDocument();
      });
    });
  });
});
