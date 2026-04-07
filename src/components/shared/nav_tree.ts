import {
  Home,
  LayoutDashboard,
  Store,
  Users,
  User,
  FileText,
  FileCheck,
  Receipt,
  Files,
  User2,
  FileSignature,
} from "lucide-react";

import { ROUTES_PATHS } from "../../routes/routes_path";

const NAV_TREE = [
  {
    id: "overview",
    label: "Overview",
    icon: Home,

    children: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        route: ROUTES_PATHS.DASHBOARD.ROOT,
      },
    ],
  },
  {
    id: "user_module",
    label: "User",
    icon: Users,
    roles: ["admin"],
    children: [
      {
        id: "user_management",
        label: "User Management",
        icon: User2,
        route: ROUTES_PATHS.DASHBOARD.USER.ROOT,
        roles: ["admin"],
      },
    ],
  },
  {
    id: "store_info",
    label: "Store Info",
    icon: Store,
    roles: ["admin"],
    children: [
      {
        id: "store_information",
        label: "Store Information",
        icon: Store,
        route: ROUTES_PATHS.DASHBOARD.STORE.ROOT,
        roles: ["admin"],
      },
      {
        id: "letter_head",
        label: "Letter Head",
        icon: FileSignature,
        route: ROUTES_PATHS.DASHBOARD.STORE.LETTER_HEAD.LIST,
        roles: ["admin"],
      },
    ],
  },
  {
    id: "customer_module",
    label: "Customer",
    icon: Users,
    roles: ["admin"],
    children: [
      {
        id: "customer",
        label: "Customer",
        icon: User,
        roles: ["admin"],
        route: ROUTES_PATHS.DASHBOARD.CUSTOMER.ROOT,
      },
    ],
  },
  {
    id: "quotation_module",
    label: "Quotation",
    icon: FileText,
    children: [
      {
        id: "quotation",
        label: "Quotation",
        icon: FileCheck,
        route: ROUTES_PATHS.DASHBOARD.QUOTATION.ROOT,
      },
      {
        id: "combined_quotation",
        label: "Combined Quotation",
        icon: Files,
        route: ROUTES_PATHS.DASHBOARD.QUOTATION.COMBINED,
      },
    ],
  },
  {
    id: "sale_module",
    label: "Sale Invoice",
    icon: Receipt, // 🔥 best choice
    children: [
      {
        id: "invoice",
        label: "Sale Invoice",
        icon: FileCheck,
        route: ROUTES_PATHS.DASHBOARD.SALE_INVOICE.ROOT,
      },
      {
        id: "combined_sale",
        label: "Combined Sale Invoice",
        icon: Files,
        route: ROUTES_PATHS.DASHBOARD.SALE_INVOICE.COMBINED,
      },
    ],
  },
];

export default NAV_TREE;
