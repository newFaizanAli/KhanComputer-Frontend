import { create } from "zustand";
import type { SaleInvoiceItem } from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/backend";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface ItemStoreProps {
  sale_invoice_items: SaleInvoiceItem[];
  isFetched: boolean;
  fetchSaleInvoiceItems: () => Promise<void>;
  fetchSaleInvoiceItemBySId: (sId: string) => Promise<SaleInvoiceItem[]>;
  addSaleInvoiceItem: (data: SaleInvoiceItem) => Promise<void>;
  editSaleInvoiceItem: (id: string, data: SaleInvoiceItem) => Promise<void>;
  deleteSaleInvoiceItem: (id: string) => Promise<void>;
}

const URL = backendRoutes.sale_invoices.item;

const SaleInvoiceItemStore = create<ItemStoreProps>((set) => ({
  sale_invoice_items: [],
  isFetched: false,

  fetchSaleInvoiceItems: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ sale_invoice_items: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  fetchSaleInvoiceItemBySId: async (sId: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: SaleInvoiceItem[];
      }>(`${URL}/sale-invoice/${sId}`);

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

  addSaleInvoiceItem: async (data: SaleInvoiceItem) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(
          resp.data.message || "Sale invoice item added successfully",
        );
        set((state) => ({
          sale_invoice_items: [...state.sale_invoice_items, resp.data.data],
        }));
      } else {
        toastError(resp.data.message || "Failed to add sale invoie item");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editSaleInvoiceItem: async (id: string, data: SaleInvoiceItem) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Sale item updated successfully");
        set((state) => ({
          sale_invoice_items: state.sale_invoice_items.map((item) =>
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

  deleteSaleInvoiceItem: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Sale item deleted successfully");
        set((state) => ({
          sale_invoice_items: state.sale_invoice_items.filter(
            (itm) => itm.id !== id,
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
}));

export default SaleInvoiceItemStore;
