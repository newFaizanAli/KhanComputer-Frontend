import axios from "axios";
import { create } from "zustand";
import { backendRoutes } from "../utilities/backend";
import { toastError } from "../utilities/toast_message";
import type { User } from "../types";

interface AuthStore {
  current_user: User | null;
  token: string | null;
  isFetched: boolean;
  signIn: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => Promise<void>;
  signUp: () => Promise<void>;
  signOut: () => void;
  fetchCurrentUser: () => Promise<void>;
}

const useAuthStore = create<AuthStore>((set, get) => ({
  current_user: null,
  token: null,
  isFetched: false,

  signIn: async ({ email, password }) => {
    try {
      const resp = await axios.post(`${backendRoutes.auth.signIn}`, {
        email,
        password,
      });
      const message = resp.data.message || "";
      const success = resp.data.success;
      if (success) {
        localStorage.setItem("kcn_token", resp.data.token);

        set({
          current_user: resp.data.data,
          token: resp.data.token,
          isFetched: true,
        });
      } else {
        toastError(message);
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },
  signUp: async () => {
    try {
      console.log("sign up");
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },
  signOut: () => {
    try {
      localStorage.removeItem("kcn_token");
      set({ current_user: null, token: null });
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },
  fetchCurrentUser: async () => {
    try {
      const token = localStorage.getItem("kcn_token");

      if (!token) return;

      const resp = await axios.get(backendRoutes.auth.profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (resp.data.success) {
        set({
          current_user: resp.data.data,
          isFetched: true,
        });
      } else {
        get().signOut();
      }
    } catch (err) {
      const error = err as Error;
      console.error(error.message);
    }
  },
}));

export default useAuthStore;
