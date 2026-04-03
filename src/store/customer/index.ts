import { create } from "zustand";
import { backendRoutes } from "../../utilities/backend";
import { toastError, toastSuccess } from "../../utilities/toast_message";
import api from "../../utilities/api";
import type { Customer, SearchOption } from "../../types";

const URL = backendRoutes.customers.root;

interface CustomerStore {
  customers: Customer[];
  isFetched: boolean;
  fetchCustomers: () => Promise<void>;
  searchCustomerByName: (name: string) => Promise<SearchOption[]>;
  addCustomer: (customerData: any) => Promise<void>;
  editCustomer: (id: string, customerData: any) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
}

const CustomerStore = create<CustomerStore>((set) => ({
  customers: [],
  isFetched: false,

  fetchCustomers: async () => {
    try {
      const resp = await api.get(URL);
      if (resp.data.success) {
        set({ customers: resp.data.data, isFetched: true });
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  searchCustomerByName: async (name: string) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: Customer[];
      }>(`${URL}/search/${name}`);

      if (resp.data.success) {
        return resp.data.data.map((supp: Customer) => ({
          value: supp.id as string,
          label: supp.name,
        }));
      } else {
        toastError(resp.data.message || "Failed to search customer");
        return [];
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
      return [];
    }
  },

  addCustomer: async (customerData: Customer) => {
    try {
      const resp = await api.post(URL, customerData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        toastSuccess(message || "Customer added successfully");
        set((state) => ({ customers: [...state.customers, resp.data.data] }));
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },

  editCustomer: async (id: string, customerData: Customer) => {
    try {
      const resp = await api.put(`${URL}/${id}`, customerData);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || " updated successfully");
        set((state) => ({
          customers: state.customers.map((sup) =>
            sup.id === id ? resp.data.data : sup,
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

  deleteCustomer: async (id: string) => {
    try {
      const resp = await api.delete(`${URL}/${id}`);
      const message = resp.data.message || "";
      if (resp.data.success) {
        toastSuccess(message || "Customer deleted successfully");
        set((state) => ({
          customers: state.customers.filter((sup) => sup.id !== id),
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

export default CustomerStore;
