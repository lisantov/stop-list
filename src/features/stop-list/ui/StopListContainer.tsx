"use client";

import { useStopModalStore } from "../model/stopModalStore";
import { useStopListItems } from "../model/query";
import type { IGetItemsParams } from "../model/types";
import StopFormModal from "./StopFormModal";
import StopListFilters from "./StopListFilters";
import StopListTable from "./StopListTable";

export default function StopListContainer({ shop, status }: IGetItemsParams) {
  const { data: items } = useStopListItems({ shop, status });
  const { itemId, close } = useStopModalStore();

  const list = items ?? [];
  const modalItem = itemId ? list.find((item) => item.id === itemId) : undefined;

  return (
    <>
      <StopListFilters shop={shop} status={status} />
      <StopListTable items={list} />
      {modalItem && (
        <StopFormModal key={itemId} item={modalItem} onClose={close} />
      )}
    </>
  );
}