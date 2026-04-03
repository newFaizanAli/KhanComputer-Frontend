export interface RoutesPathProps {
  HOME: string;
  AUTH: {
    SIGNIN: string;
    SIGNUP: string;
  };
  ANALYTICS: { ROOT: string };
  DASHBOARD: {
    ROOT: string;
    STORE: {
      ROOT: string;
    };
    USER: {
      ROOT: string;
    };
    CUSTOMER: {
      ROOT: string;
    };
    QUOTATION: {
      ROOT: string;
      ITEM: string;
      COMBINED: string;
    };
    SALE_INVOICE: {
      ROOT: string;
      ITEM: string;
      COMBINED: string;
    };
  };
}

export const ROUTES_PATHS: RoutesPathProps = {
  HOME: "/",
  AUTH: {
    SIGNIN: "/",
    SIGNUP: "/auth/signup",
  },
  ANALYTICS: {
    ROOT: "/analytics",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    STORE: {
      ROOT: "/dashboard/store",
    },
    USER: {
      ROOT: "/dashboard/users",
    },
    CUSTOMER: {
      ROOT: "/dashboard/customers",
    },
    QUOTATION: {
      ROOT: "/dashboard/quotation",
      ITEM: "/dashboard/quotation/item",
      COMBINED: "/dashboard/quotation/combined",
    },
    SALE_INVOICE: {
      ROOT: "/dashboard/sale-invoice",
      ITEM: "/dashboard/sale-invoice/item",
      COMBINED: "/dashboard/sale-invoice/combined",
    },
  },
};
