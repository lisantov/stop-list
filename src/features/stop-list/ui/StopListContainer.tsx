"use client";

import { useStopModalStore } from "../model/stopModalStore";
import { useStopListItems } from "../model/query";
import type { IGetItemsParams } from "../model/types";
import StopFormModal from "./StopFormModal";
import StopListError from "./StopListError";
import StopListFilters from "./StopListFilters";
import StopListSkeleton from "./StopListSkeleton";
import StopListTable from "./StopListTable";

export default function StopListContainer({ shop, status }: IGetItemsParams) {
  const { data, isLoading, isError, error, refetch } = useStopListItems({
    shop,
    status,
  });
  const { itemId, close } = useStopModalStore();

  const items = data ?? [];
  const modalItem = itemId ? items.find((item) => item.id === itemId) : undefined;

  return (
    <>
      <StopListFilters shop={shop} status={status} />
      {isLoading && !data && <StopListSkeleton count={3} />}
      {!isLoading && isError && !data && (
        <StopListError message={error?.message} onRetry={() => refetch()} />
      )}
      {data && (
        <>
          <StopListTable items={items} />
          {modalItem && (
            <StopFormModal key={itemId} item={modalItem} onClose={close} />
          )}
        </>
      )}
    </>
  );
}