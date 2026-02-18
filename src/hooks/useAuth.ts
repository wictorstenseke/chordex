import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInAnonymously,
  type User as FirebaseUser,
} from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";

const LOCAL_USER_KEY = "chordex-local-user-id";

interface UseAuthResult {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
}

const getOrCreateLocalUserId = (): string => {
  const existing = localStorage.getItem(LOCAL_USER_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(LOCAL_USER_KEY, id);
  return id;
};

const isFirebaseConfigured = (): boolean => getFirebaseAuth() !== null;

const getInitialUser = (): FirebaseUser | null => {
  if (isFirebaseConfigured()) return null;
  const localId = getOrCreateLocalUserId();
  return { uid: localId } as FirebaseUser;
};

/**
 * Auth state hook. When Firebase is configured and no user is signed in,
 * automatically signs in anonymously so the app can create songs/setlists.
 * When Firebase is not configured, provides a localStorage-backed local user.
 */
export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<FirebaseUser | null>(getInitialUser);
  const [isLoading, setIsLoading] = useState(isFirebaseConfigured);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;

    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        setError(null);
      } else {
        setUser(null);
        signInAnonymously(auth).catch((err) => {
          setError(err instanceof Error ? err : new Error(String(err)));
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoading, error };
};
