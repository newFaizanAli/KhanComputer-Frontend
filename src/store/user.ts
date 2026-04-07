import { create } from "zustand";
import type { User } from "../types";
import { backendRoutes } from "../utilities/backend";
import { toastError, toastSuccess } from "../utilities/toast_message";
import api from "../utilities/api";

interface UserStore {
  isFetched: boolean;
  users: User[];
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: number) => Promise<any>;
  addUser: (userData: User) => Promise<boolean>;
  editUser: (id: string, userData: User) => Promise<boolean>;
}

const URL: string = backendRoutes.user.root;

const useUserStore = create<UserStore>((set) => ({
  isFetched: false,
  users: [],

  fetchUsers: async () => {
    try {
      const resp = await api.get<{ success: boolean; data: User[] }>(URL);

      if (resp.data.success) {
        set({ users: resp.data.data, isFetched: true });
      }
    } catch (err: unknown) {
      const error = err as Error;
      toastError(error.message);
      console.error(error.message);
    }
  },

  fetchUserById: async (id) => {
    try {
      const resp = await api.get<{
        success: boolean;
        message: string;
        data: User;
      }>(`${URL}/${id}`);

      if (resp.data.success) {
        return resp.data.data as User;
      } else {
        toastError(resp.data.message);
      }
    } catch (err: unknown) {
      const error = err as Error;
      toastError(error.message);
    }
  },

  addUser: async (userData: User) => {
    try {
      const resp = await api.post(backendRoutes.auth.register, userData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        const newUser = resp.data.data;

        set((state) => ({
          users: [...state.users, newUser],
        }));

        toastSuccess(message || "User added successfully");

        return true;
      } else {
        toastError(message);
        return false;
      }
    } catch (err) {
      const error = err as Error;
      toastError(error.message);
      return false;
    }
  },

  editUser: async (id: string, userData: User) => {
    try {
      const resp = await api.put(`${URL}/${id}`, userData);
      const message = resp.data.message || "";

      if (resp.data.success) {
        const updatedUser = resp.data.data;
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? updatedUser : user,
          ),
        }));
        toastSuccess(message || "User updated successfully");
        return true;
      } else {
        toastError(message);
        return false;
      }
    } catch (err) {
      const error = err as Error;
      toastError(error.message);
      return false;
    }
  },
}));

export default useUserStore;
