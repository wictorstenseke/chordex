import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSetlist as createSetlistFn,
  deleteSetlist as deleteSetlistFn,
  getSetlist,
  getSetlistsForUser,
  updateSetlist as updateSetlistFn,
} from "@/lib/setlists";

import type { SetlistInput } from "@/types/songbook";

export const setlistKeys = {
  all: ["setlists"] as const,
  list: (ownerId: string) => [...setlistKeys.all, "list", ownerId] as const,
  detail: (setlistId: string) =>
    [...setlistKeys.all, "detail", setlistId] as const,
};

export const useSetlistQuery = (setlistId: string | undefined) => {
  return useQuery({
    queryKey: setlistKeys.detail(setlistId ?? ""),
    queryFn: () => getSetlist(setlistId!),
    enabled: !!setlistId,
  });
};

export const useSetlistsQuery = (ownerId: string | undefined) => {
  return useQuery({
    queryKey: setlistKeys.list(ownerId ?? ""),
    queryFn: () => getSetlistsForUser(ownerId!),
    enabled: !!ownerId,
  });
};

export const useCreateSetlistMutation = (ownerId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: SetlistInput) => createSetlistFn(ownerId!, input),
    onSuccess: () => {
      if (ownerId) {
        void queryClient.invalidateQueries({
          queryKey: setlistKeys.list(ownerId),
        });
      }
    },
  });
};

export const useUpdateSetlistMutation = (ownerId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      setlistId,
      input,
    }: {
      setlistId: string;
      input: Partial<SetlistInput>;
    }) => updateSetlistFn(setlistId, input),
    onSuccess: (_data, variables) => {
      void queryClient.invalidateQueries({
        queryKey: setlistKeys.detail(variables.setlistId),
      });
      if (ownerId) {
        void queryClient.invalidateQueries({
          queryKey: setlistKeys.list(ownerId),
        });
      }
    },
  });
};

export const useDeleteSetlistMutation = (ownerId: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (setlistId: string) => deleteSetlistFn(setlistId),
    onSettled: () => {
      if (ownerId) {
        void queryClient.invalidateQueries({
          queryKey: setlistKeys.list(ownerId),
        });
      }
    },
  });
};
