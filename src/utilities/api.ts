import axios from "axios";
import { backendConfig } from "./backend";
import { useAuthStore } from "../store";

const api = axios.create({
  baseURL: `${backendConfig.baseUrl}${backendConfig.apiPath}`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kcn_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.data.token_auth === false) {
      const { signOut } = useAuthStore.getState();
      signOut();
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { signOut } = useAuthStore.getState();
      signOut();
    }
    return Promise.reject(error);
  },
);

export default api;
