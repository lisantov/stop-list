import { IGetItemsParams } from "../types";

export const stopListKeys = {
  all: () => ["stoplist"] as const,
  lists: () => [...stopListKeys.all(), "list"] as const,
  list: (params?: IGetItemsParams) =>
    params
      ? ([...stopListKeys.lists(), params] as const)
      : stopListKeys.lists(),
};
