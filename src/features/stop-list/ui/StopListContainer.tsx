"use client";

import { useStopListItems } from "../model/query";
import type { IGetItemsParams } from "../model/types";
import StopListTable from "./StopListTable";

export default function StopListContainer({ shop, status }: IGetItemsParams) {
  const { data, isLoading } = useStopListItems({ shop, status });

  if (isLoading) return "Loading...";

  return <StopListTable items={data ?? []} />;
}
