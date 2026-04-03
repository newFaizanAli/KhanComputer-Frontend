import { create } from "zustand";
import type {
  Quotation,
  CombinedDocumentFormValues,
  SearchOption,
} from "../../types";
import api from "../../utilities/api";
import { backendRoutes } from "../../utilities/backend";
import { toastError, toastSuccess } from "../../utilities/toast_message";

interface QuotationStoreProps {
  quotations: Quotation[];
  isFetched: boolean;
  fetchQuotations: () => Promise<void>;
  searchQuotationByCode: (code: string) => Promise<SearchOption[]>;
  addQuotation: (data: Partial<Quotation>) => Promise<Quotation | undefined>;
  editQuotation: (
    id: string,
    data: Partial<Quotation>,
  ) => Promise<Quotation | undefined>;
  addCombinedQuotation: (data: CombinedDocumentFormValues) => Promise<void>;
  deleteQuotation: (id: string) => Promise<void>;
}

const URL = backendRoutes.quotations.root;

const QuotationStore = create<QuotationStoreProps>((set) => ({
  quotations: [],
  isFetched: false,

  fetchQuotations: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ quotations: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  addQuotation: async (data: Partial<Quotation>) => {
    try {
      const resp = await api.post(URL, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Quotation added successfully");
        set((state) => ({
          quotations: [...state.quotations, resp.data.data],
        }));

        return resp.data.data;
      } else {
        toastError(resp.data.message || "Failed to add quotation");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editQuotation: async (id: string, data: Partial<Quotation>) => {
    try {
      const resp = await api.put(`${URL}/${id}`, data);

      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Quotation updated successfully");

        set((state) => ({
          quotations: state.quotations.map((quotation) =>
            quotation.id === id ? resp.data.data : quotation,
          ),
        }));

        return resp.data.data as Quotation;
      } else {
        toastError(message || "Failed to update quotation");
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      toastError("Something went wrong");
    }
  },

  searchQuotationByCode: async (code: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Quotation[];
      }>(`${URL}/search/${code}`);

      if (resp.data.success) {
        return resp.data.data.map((pur: Quotation) => ({
          value: pur.id as string,
          label: `${pur.code}`,
        }));
      } else {
        toastError(resp.data.message || "Failed to search quotation");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addCombinedQuotation: async (data: CombinedDocumentFormValues) => {
    try {
      const resp = await api.post(`${URL}/combined`, data);
      if (resp.data.success) {
        toastSuccess(resp.data.message || "Quotation created successfully");
        set((state) => ({
          quotations: [...state.quotations, resp.data.data.quotation],
        }));
      } else {
        toastError(resp.data.message || "Failed to create quotation");
      }
    } catch (err) {
      console.error((err as Error).message);
    }
  },

  deleteQuotation: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Quotation deleted successfully");
        set((state) => ({
          quotations: state.quotations.filter((ord) => ord.id !== id),
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

export default QuotationStore;
