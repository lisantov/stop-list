import {
  keepPreviousData,
  queryOptions,
  useQuery,
} from "@tanstack/react-query";
import { stopListService } from "../api";
import { stopListKeys } from "./stopList.keys";
import { IGetItemsParams } from "../types";

export function stopListQuery(params?: IGetItemsParams) {
  return queryOptions({
    queryKey: stopListKeys.list(params),
    queryFn: () => stopListService.getItems(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });
}

export function useStopListItems(params?: IGetItemsParams) {
  return useQuery(stopListQuery(params));
}