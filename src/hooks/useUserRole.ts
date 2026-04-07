import { useAuthStore } from "../store";

export const useUserRole = () => {
  const { current_user } = useAuthStore();

  const role = current_user?.role;

  return {
    role,
    isAdmin: role === "admin",
    isSubAdmin: role === "subadmin",
  };
};
