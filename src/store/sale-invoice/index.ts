import { create } from "zustand";
import type {
  SaleInvoice,
  CombinedDocumentFormValues,
  SearchOption,
} from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/backend";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface InvoiceStoreProps {
  sale_invoices: SaleInvoice[];
  isFetched: boolean;
  fetchSaleInvoices: () => Promise<void>;
  searchInvoiceByCode: (code: string) => Promise<SearchOption[]>;
  addSaleInvioce: (
    data: Partial<SaleInvoice>,
  ) => Promise<SaleInvoice | undefined>;
  editSaleInvioce: (
    id: string,
    data: Partial<SaleInvoice>,
  ) => Promise<SaleInvoice | undefined>;
  addCombinedSaleInvoice: (data: CombinedDocumentFormValues) => Promise<void>;
  deleteSaleInvoice: (id: string) => Promise<void>;
}

const URL = backendRoutes.sale_invoices.root;

const SaleInvoiceStore = create<InvoiceStoreProps>((set) => ({
  sale_invoices: [],
  isFetched: false,

  fetchSaleInvoices: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ sale_invoices: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addSaleInvioce: async (data: Partial<SaleInvoice>) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Sale invoice added successfully");
        set((state) => ({
          sale_invoices: [...state.sale_invoices, resp.data.data],
        }));

        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to add invoice");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editSaleInvioce: async (id: string, data: Partial<SaleInvoice>) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);

      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Sale invoice updated successfully");

        set((state) => ({
          sale_invoices: state.sale_invoices.map((invoice) =>
            invoice.id === id ? resp.data.data : invoice,
          ),
        }));

        return resp.data.data as SaleInvoice;
      } else {
        toastError(message || "Failed to update invoice");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      toastError("Something went wrong");
    }
  },

  searchInvoiceByCode: async (code: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: SaleInvoice[];
      }>(`${URL}/search/${code}`);

      if (resp.data.success) {
        return resp.data.data.map((inv: SaleInvoice) => ({
          value: inv.id as string,
          label: `${inv.code}`,
        }));
      } else {
        toastError(resp.data.message || "Failed to search invoice");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addCombinedSaleInvoice: async (data: CombinedDocumentFormValues) => {
    try {
      const resp = await api.post(`${URL}/combined`, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Sale Invoice created successfully");
        set((state) => ({
          sale_invoices: [...state.sale_invoices, resp.data.data.invoice],
        }));
      } else {
        toastError(resp.data.message || "Failed to create invoice");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  },

  deleteSaleInvoice: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Invoice deleted successfully");
        set((state) => ({
          sale_invoices: state.sale_invoices.filter((inv) => inv.id !== id),
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

export default SaleInvoiceStore;
