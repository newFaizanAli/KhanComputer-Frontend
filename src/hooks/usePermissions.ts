import { useAuthStore } from "../store";

export type AppRole = "admin" | "subadmin";

// Pages only admins can visit
const ADMIN_ONLY_ROUTES = ["/dashboard/users", "/auth/profile"];

export function usePermissions() {
  const { current_user } = useAuthStore();
  const role = current_user?.role as AppRole | undefined;
  const isAdmin = role === "admin";

  return {
    isAdmin,
    isSubadmin: role === "subadmin",
    canEdit: isAdmin,
    canDelete: isAdmin,
    canAccessRoute: (path: string) => {
      if (isAdmin) return true;
      return !ADMIN_ONLY_ROUTES.includes(path);
    },
  };
}
