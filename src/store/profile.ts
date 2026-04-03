import { create } from "zustand";
import type { User } from "../types";
import api from "../utilities/api";
import { toastError, toastSuccess } from "../utilities/toast_message";
import { backendRoutes } from "../utilities/backend";

interface UserStore {
  profile: User | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  updatePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<boolean>;
}

const URL: string = backendRoutes.auth.profile;

const useProfileStore = create<UserStore>((set) => ({
  profile: null,

  fetchProfile: async () => {
    try {
      const resp = await api.get(URL);

      if (resp.data.success) {
        set({ profile: resp.data.data });
      }
    } catch (err) {
      toastError((err as Error).message);
    }
  },

  updateProfile: async (data) => {
    try {
      const resp = await api.put(URL, data);

      if (resp.data.success) {
        set({ profile: resp.data.data });
        toastSuccess("Profile updated");
        return true;
      }
      return false;
    } catch (err) {
      toastError((err as Error).message);
      return false;
    }
  },

  updatePassword: async (data) => {
    try {
      const resp = await api.put(`${URL}/password`, data);

      if (resp.data.success) {
        toastSuccess("Password updated");
        return true;
      }
      return false;
    } catch (err) {
      toastError((err as Error).message);
      return false;
    }
  },
}));

export default useProfileStore;
