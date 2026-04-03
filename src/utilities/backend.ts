export const backendConfig = {
  baseUrl: "http://localhost:3000",
  apiPath: "/api",
};

export const backendRoutes = {
  auth: {
    signIn: `${backendConfig.baseUrl}${backendConfig.apiPath}/auth/login`,
    register: `${backendConfig.baseUrl}${backendConfig.apiPath}/auth/register`,
    profile: `${backendConfig.baseUrl}${backendConfig.apiPath}/auth/profile`,
  },
  store: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/store`,
  },
  user: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/user`,
  },
  customers: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/customers`,
  },
  quotations: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/quotations`,
    item: `${backendConfig.baseUrl}${backendConfig.apiPath}/quotations/item`,
  },
  sale_invoices: {
    root: `${backendConfig.baseUrl}${backendConfig.apiPath}/sale-invoices`,
    item: `${backendConfig.baseUrl}${backendConfig.apiPath}/sale-invoices/item`,
  },
};
