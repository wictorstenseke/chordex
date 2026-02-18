import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSong as createSongFn,
  deleteSong as deleteSongFn,
  getSong,
  getSongsForUser,
} from "@/lib/songs";

import type { SongInput } from "@/types/songbook";

export const songKeys = {
  all: ["songs"] as const,
  list: (ownerId: string) => [...songKeys.all, "list", ownerId] as const,
  detail: (songId: string) => [...songKeys.all, "detail", songId] as const,
};

export const useSongQuery = (songId: string | undefined) => {
  return useQuery({
    queryKey: songKeys.detail(songId ?? ""),
    queryFn: () => getSong(songId!),
    enabled: !!songId,
  });
};

export const useSongsQuery = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: songKeys.list(ownerId ?? ""),
    queryFn: () => getSongsForUser(ownerId!),
    enabled: !!ownerId,
  });
};

export const useCreateSongMutation = (ownerId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SongInput) => createSongFn(ownerId!, input),
    onSuccess: () => {
      if (ownerId) {
        void queryClient.invalidateQueries({ queryKey: songKeys.list(ownerId) });
      }
    },
  });
};

export const useDeleteSongMutation = (ownerId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (songId: string) => deleteSongFn(songId),
    onSettled: () => {
      if (ownerId) {
        void queryClient.invalidateQueries({ queryKey: songKeys.list(ownerId) });
      }
    },
  });
};
