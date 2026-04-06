import { create } from "zustand";
import type { LetterHead, SearchOption } from "../types";
import api from "../utilities/api";
import { backendRoutes } from "../utilities/backend";
import { toastError, toastSuccess } from "../utilities/toast_message";

interface LetterStoreProps {
  letter_heads: LetterHead[];
  isFetched: boolean;
  fetchLetterHeads: () => Promise<void>;
  searchLetterHeadByCode: (code: string) => Promise<SearchOption[]>;
  addLetterHead: (data: Partial<LetterHead>) => Promise<LetterHead | undefined>;
  editLetterHead: (
    id: string,
    data: Partial<LetterHead>,
  ) => Promise<LetterHead | undefined>;
  deleteLetterHead: (id: string) => Promise<void>;
}

const URL = backendRoutes.store.letter_head;

const LetterHeadStore = create<LetterStoreProps>((set) => ({
  letter_heads: [],
  isFetched: false,

  fetchLetterHeads: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ letter_heads: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addLetterHead: async (data: Partial<LetterHead>) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Letter head added successfully");
        set((state) => ({
          letter_heads: [...state.letter_heads, resp.data.data],
        }));

        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to add letter");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editLetterHead: async (id: string, data: Partial<LetterHead>) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);

      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Letter head updated successfully");

        set((state) => ({
          letter_heads: state.letter_heads.map((head) =>
            head.id === id ? resp.data.data : head,
          ),
        }));

        return resp.data.data as LetterHead;
      } else {
        toastError(message || "Failed to update letter head");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      toastError("Something went wrong");
    }
  },

  searchLetterHeadByCode: async (code: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: LetterHead[];
      }>(`${URL}/search/${code}`);

      if (resp.data.success) {
        return resp.data.data.map((inv: LetterHead) => ({
          value: inv.id as string,
          label: `${inv.code}`,
        }));
      } else {
        toastError(resp.data.message || "Failed to search letter head");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  deleteLetterHead: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Letter head deleted successfully");
        set((state) => ({
          letter_heads: state.letter_heads.filter((head) => head.id !== id),
        }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },
}));

export default LetterHeadStore;
