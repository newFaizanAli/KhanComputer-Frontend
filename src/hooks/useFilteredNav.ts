import { useMemo } from "react";
import NAV_TREE from "../components/shared/nav_tree";
import { useUserRole } from "./useUserRole";

export const useFilteredNav = () => {
  const { role } = useUserRole();

  const filteredNav = useMemo(() => {
    const filterNav = (items: any[]): any[] => {
      return items
        .filter((item) => !item.roles || item.roles.includes(role))
        .map((item) => ({
          ...item,
          children: item.children ? filterNav(item.children) : [],
        }));
    };

    return filterNav(NAV_TREE);
  }, [role]);

  return filteredNav;
};
