import { lazy } from "react";

// auth
const SignInPage = lazy(() => import("./auth/SignInPage"));
// public
const NotFound = lazy(() => import("./public/NotFound"));
// protected
const DashboardPage = lazy(() => import("./protected/Dashboard"));
const AnalyticsPage = lazy(() => import("./protected/Analytics"));
const UserPage = lazy(() => import("./protected/user/UserPage"));
const CustomerPage = lazy(() => import("./protected/customer/CustomerPage"));
const StorePage = lazy(() => import("./protected/store/StorePage"));
const LetterHeadPage = lazy(() => import("./protected/store/LetterHeadPage"));
const LetterHeadListPage = lazy(() => import("./protected/store/LetterHeadListPage"));
const ProfilePage = lazy(() => import("./protected/ProfilePage"));
const QuotationPage = lazy(() => import("./protected/quotation/QuotationPage"));
const QuotationItemPage = lazy(() => import("./protected/quotation/QuotationItem"));
const CombinedQuotationPage = lazy(() => import("./protected/quotation/CombinedQuotation"));
const SaleInvoicePage = lazy(() => import("./protected/sale-invoice/SaleInvoicePage"));
const SaleInvoiceItemPage = lazy(() => import("./protected/sale-invoice/SaleInvoiceItem"));
const CombinedSaleInvoicePage = lazy(() => import("./protected/sale-invoice/CombinedSaleInvoice"));

export {
    SignInPage,
    NotFound,
    DashboardPage,
    AnalyticsPage,
    UserPage,
    CustomerPage,
    StorePage,
    LetterHeadPage,
    LetterHeadListPage,
    ProfilePage,
    QuotationPage,
    QuotationItemPage,
    CombinedQuotationPage,
    SaleInvoicePage,
    SaleInvoiceItemPage,
    CombinedSaleInvoicePage
}