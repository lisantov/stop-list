import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { MenuItem, StopItemPayload } from "@/types/menu";
import { useToastStore } from "@/shared";
import { stopListService } from "../api";
import { stopListKeys } from "./stopList.keys";
import { useSavingStore } from "../savingStore";

interface ListSnapshot {
  queryKey: QueryKey;
  data: MenuItem[] | undefined;
}

function snapshotLists(queryClient: QueryClient): ListSnapshot[] {
  return queryClient
    .getQueriesData<MenuItem[]>({ queryKey: stopListKeys.all() })
    .map(([queryKey, data]) => ({ queryKey, data }));
}

function restoreLists(queryClient: QueryClient, snapshot: ListSnapshot[]) {
  snapshot.forEach(({ queryKey, data }) => {
    queryClient.setQueryData(queryKey, data);
  });
}

function replaceItem(
  items: MenuItem[] | undefined,
  id: string,
  updater: (item: MenuItem) => MenuItem,
): MenuItem[] | undefined {
  return items?.map((item) => (item.id === id ? updater(item) : item));
}

function reportError(error: unknown, fallback: string) {
  const message = error instanceof Error && error.message ? error.message : fallback;
  useToastStore.getState().push(message);
}

export function useStopItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: StopItemPayload }) =>
      stopListService.stop(id, body),

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: stopListKeys.all() });
      const previous = snapshotLists(queryClient);

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: stopListKeys.all() },
        (items) =>
          replaceItem(items, id, (item) => ({
            ...item,
            status: { kind: "stopped", reason: body.reason, until: body.until },
            updatedAt: new Date().toISOString(),
          })),
      );
      useSavingStore.getState().start(id);
      return { previous };
    },

    onError: (error, _variables, context) => {
      if (context?.previous) restoreLists(queryClient, context.previous);
      reportError(error, "Не удалось остановить позицию");
    },

    onSettled: (_data, error, { id }) => {
      useSavingStore.getState().stop(id);
      if (!error) queryClient.invalidateQueries({ queryKey: stopListKeys.all() });
    },
  });
}

export function useResumeItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => stopListService.resume(id),

    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: stopListKeys.all() });
      const previous = snapshotLists(queryClient);

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: stopListKeys.all() },
        (items) =>
          replaceItem(items, id, (item) => ({
            ...item,
            status: { kind: "available" },
            updatedAt: new Date().toISOString(),
          })),
      );
      useSavingStore.getState().start(id);
      return { previous };
    },

    onError: (error, _variables, context) => {
      if (context?.previous) restoreLists(queryClient, context.previous);
      reportError(error, "Не удалось вернуть позицию в продажу");
    },

    onSettled: (_data, error, id) => {
      useSavingStore.getState().stop(id);
      if (!error) queryClient.invalidateQueries({ queryKey: stopListKeys.all() });
    },
  });
}

export function useUpdateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: StopItemPayload }) =>
      stopListService.update(id, body),

    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: stopListKeys.all() });
      const previous = snapshotLists(queryClient);

      queryClient.setQueriesData<MenuItem[]>(
        { queryKey: stopListKeys.all() },
        (items) =>
          replaceItem(items, id, (item) => ({
            ...item,
            status: { kind: "stopped", reason: body.reason, until: body.until },
            updatedAt: new Date().toISOString(),
          })),
      );
      useSavingStore.getState().start(id);
      return { previous };
    },

    onError: (error, _variables, context) => {
      if (context?.previous) restoreLists(queryClient, context.previous);
      reportError(error, "Не удалось сохранить изменения");
    },

    onSettled: (_data, error, { id }) => {
      useSavingStore.getState().stop(id);
      if (!error) queryClient.invalidateQueries({ queryKey: stopListKeys.all() });
    },
  });
}