import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MenuItem, StopItemPayload } from "@/types/menu";
import { stopListService } from "../api";
import { stopListKeys } from "./stopList.keys";

export function useStopItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: StopItemPayload }) =>
      stopListService.stop(id, body),

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: stopListKeys.all() });
      const previous = queryClient.getQueriesData<MenuItem[]>({
        queryKey: stopListKeys.all(),
      });

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: stopListKeys.all() },
        (items) =>
          items?.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: {
                    kind: "stopped",
                    reason: body.reason,
                    until: body.until,
                  },
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
      );

      return { previous };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(stopListKeys.all(), ctx.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: stopListKeys.all() });
    },
  });
}

export function useResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stopListService.resume(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: stopListKeys.all() });
      const previous = queryClient.getQueriesData<MenuItem[]>({
        queryKey: stopListKeys.all(),
      });

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: stopListKeys.all() },
        (items) =>
          items?.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: { kind: "available" },
                  updatedAt: new Date().toISOString(),
                }
              : item,
          ),
      );

      return { previous };
    },

    onError: (_e, _v, ctx) => {
      if (ctx?.previous)
        queryClient.setQueryData(stopListKeys.all(), ctx.previous);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: stopListKeys.all() });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: StopItemPayload }) =>
      stopListService.update(id, body),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: stopListKeys.all() });
    },
  });
}
