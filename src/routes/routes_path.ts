export interface RoutesPathProps {
  HOME: string;
  AUTH: {
    SIGNIN: string;
    SIGNUP: string;
    PROFILE: string;
  };
  ANALYTICS: { ROOT: string };
  DASHBOARD: {
    ROOT: string;
    STORE: {
      ROOT: string;
      LETTER_HEAD: {
        LIST: string;
        FORM: string;
      };
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
    PROFILE: "/auth/profile",
  },
  ANALYTICS: {
    ROOT: "/analytics",
  },
  DASHBOARD: {
    ROOT: "/dashboard",
    STORE: {
      ROOT: "/dashboard/store",
      LETTER_HEAD: {
        FORM: "/dashboard/store/letter-head",
        LIST: "/dashboard/store/letter-head/list",
      },
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
