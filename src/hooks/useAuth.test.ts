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
  });

  it("should set isLoading to false when Firebase is not configured", async () => {
    vi.mocked(getFirebaseAuth).mockReturnValue(null);

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).toBeNull();
    expect(mockOnAuthStateChanged).not.toHaveBeenCalled();
  });

  it("should set user when onAuthStateChanged fires with a user", async () => {
    const mockUser = { uid: "user-123" };
    let authCallback: ((u: typeof mockUser | null) => void) | null = null;

    vi.mocked(getFirebaseAuth).mockReturnValue({} as never);
    mockOnAuthStateChanged.mockImplementation((_auth: unknown, cb: (u: unknown) => void) => {
      authCallback = cb as (u: typeof mockUser | null) => void;
      queueMicrotask(() => authCallback?.(mockUser));
      return vi.fn();
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
    expect(result.current.user).toEqual(mockUser);
  });
});
