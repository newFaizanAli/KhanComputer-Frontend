import { create } from "zustand";
import type { QuotationItem } from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/backend";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface ItemStoreProps {
  quotation_items: QuotationItem[];
  isFetched: boolean;
  fetchQuotationItems: () => Promise<void>;
  fetchQuotationItemByQId: (orderId: string) => Promise<QuotationItem[]>;
  addQuotationItem: (data: QuotationItem) => Promise<void>;
  editQuotationItem: (id: string, data: QuotationItem) => Promise<void>;
  deleteQuotationItem: (id: string) => Promise<void>;
}

const URL = backendRoutes.quotations.item;

const QuotationItemStore = create<ItemStoreProps>((set) => ({
  quotation_items: [],
  isFetched: false,

  fetchQuotationItems: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ quotation_items: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  fetchQuotationItemByQId: async (qId: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: QuotationItem[];
      }>(`${URL}/quotation/${qId}`);

      if (resp.data.success) {
        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to fetch items");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addQuotationItem: async (data: QuotationItem) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Quotation item added successfully");
        set((state) => ({
          quotation_items: [...state.quotation_items, resp.data.data],
        }));
      } else {
        toastError(resp.data.message || "Failed to add quotion item");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editQuotationItem: async (id: string, data: QuotationItem) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Quotation item updated successfully");
        set((state) => ({
          quotation_items: state.quotation_items.map((item) =>
            item.id === id ? resp.data.data : item,
          ),
        }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  deleteQuotationItem: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Quotation item deleted successfully");
        set((state) => ({
          quotation_items: state.quotation_items.filter((itm) => itm.id !== id),
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

export default QuotationItemStore;
