import { useEffect, useState } from "react";

import {
  onAuthStateChanged,
  signInAnonymously,
  type User as FirebaseUser,
} from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";

interface UseAuthResult {
  user: FirebaseUser | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Auth state hook. When Firebase is configured and no user is signed in,
 * automatically signs in anonymously so the app can create songs/setlists.
 */
export const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      queueMicrotask(() => setIsLoading(false));
      return;
    }

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
