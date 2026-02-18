import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { getFirebaseAuth } from "@/lib/firebase";

import { useAuth } from "./useAuth";

const mockOnAuthStateChanged = vi.fn();
const mockSignInAnonymously = vi.fn();

vi.mock("@/lib/firebase", () => ({
  getFirebaseAuth: vi.fn(),
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
  signInAnonymously: (...args: unknown[]) => mockSignInAnonymously(...args),
}));

describe("useAuth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should auto-create a local user when Firebase is not configured", async () => {
    vi.mocked(getFirebaseAuth).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).not.toBeNull();
    expect(result.current.user!.uid).toBeTruthy();
    expect(mockOnAuthStateChanged).not.toHaveBeenCalled();
  });

  it("should persist the local user ID across renders", async () => {
    vi.mocked(getFirebaseAuth).mockReturnValue(null);

    const { result: result1 } = renderHook(() => useAuth());
    await waitFor(() => expect(result1.current.isLoading).toBe(false));
    const firstUid = result1.current.user!.uid;

    const { result: result2 } = renderHook(() => useAuth());
    await waitFor(() => expect(result2.current.isLoading).toBe(false));

    expect(result2.current.user!.uid).toBe(firstUid);
  });

  it("should set user when onAuthStateChanged fires with a user", async () => {
    const mockUser = { uid: "user-123" };

    vi.mocked(getFirebaseAuth).mockReturnValue({} as never);
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (u: unknown) => void) => {
      queueMicrotask(() => cb(mockUser));
      return vi.fn();
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).toEqual(mockUser);
  });
});
