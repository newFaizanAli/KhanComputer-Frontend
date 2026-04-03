import { create } from "zustand";
import api from "../utilities/api";
import { toastError, toastSuccess } from "../utilities/toast_message";
import type { StoreInfo } from "../types";
import { backendRoutes } from "../utilities/backend";

const URL = backendRoutes.store.root;

interface StoreStore {
  store: StoreInfo | null;
  isFetched: boolean;
  fetchStore: () => Promise<void>;
  addStore: (data: StoreInfo) => Promise<boolean>;
  updateStore: (id: number, data: Partial<StoreInfo>) => Promise<boolean>;
}

const useStoreInfo = create<StoreStore>((set) => ({
  store: null,
  isFetched: false,

  fetchStore: async () => {
    try {
      const resp = await api.get<{ success: boolean; data: StoreInfo }>(URL);
      if (resp.data.success) set({ store: resp.data.data, isFetched: true });
    } catch (err: unknown) {
      toastError((err as Error).message);
    }
  },

  addStore: async (data) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        set({ store: resp.data.data, isFetched: true });
        toastSuccess(resp.data.message || "Store added successfully");
        return true;
      }
      toastError(resp.data.message || "Failed to add store");
      return false;
    } catch (err) {
      toastError((err as Error).message);
      return false;
    }
  },

  updateStore: async (id, data) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);
      if (resp.data.success) {
        set({ store: resp.data.data, isFetched: true });
        toastSuccess(resp.data.message || "Store updated successfully");
        return true;
      }
      toastError(resp.data.message || "Failed to update store");
      return false;
    } catch (err) {
      toastError((err as Error).message);
      return false;
    }
  },
}));

export default useStoreInfo;
