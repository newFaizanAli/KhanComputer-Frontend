import type { ReactNode } from "react"
import { ROUTES_PATHS } from "./routes_path"
import { MainLayout, ProtectedLayout } from "../layout"
import {
    SignInPage, DashboardPage, AnalyticsPage, UserPage, NotFound, CustomerPage, StorePage,
    QuotationPage, QuotationItemPage, CombinedQuotationPage, LetterHeadPage, LetterHeadListPage,
    SaleInvoicePage, SaleInvoiceItemPage, CombinedSaleInvoicePage, ProfilePage
} from "../pages";
import RoleGuard from "../components/shared/RoleGuard";


const appRoutes: {
    path: string,
    element: ReactNode,

    children?: {
        path: string,
        element: ReactNode
    }[]
}[] = [
        {
            path: '/',
            element: <MainLayout />,
            children: [
                { path: ROUTES_PATHS.AUTH.SIGNIN, element: <SignInPage /> },
            ],
        },
        {
            path: '/',
            element: <ProtectedLayout />,
            children: [
                { path: ROUTES_PATHS.DASHBOARD.ROOT, element: <DashboardPage /> },
                { path: ROUTES_PATHS.DASHBOARD.USER.ROOT, element: <RoleGuard path={ROUTES_PATHS.DASHBOARD.USER.ROOT}><UserPage /></RoleGuard> },
                { path: ROUTES_PATHS.ANALYTICS.ROOT, element: <AnalyticsPage /> },
                { path: ROUTES_PATHS.DASHBOARD.STORE.ROOT, element: <RoleGuard path={ROUTES_PATHS.DASHBOARD.STORE.ROOT}><StorePage /></RoleGuard> },
                { path: ROUTES_PATHS.DASHBOARD.STORE.LETTER_HEAD.LIST, element: <RoleGuard path={ROUTES_PATHS.DASHBOARD.STORE.LETTER_HEAD.LIST}><LetterHeadListPage /></RoleGuard> },
                { path: ROUTES_PATHS.DASHBOARD.STORE.LETTER_HEAD.FORM, element: <RoleGuard path={ROUTES_PATHS.DASHBOARD.STORE.LETTER_HEAD.FORM}><LetterHeadPage /></RoleGuard> },
                { path: ROUTES_PATHS.AUTH.PROFILE, element: <ProfilePage /> },
                { path: ROUTES_PATHS.DASHBOARD.CUSTOMER.ROOT, element: <CustomerPage /> },
                { path: ROUTES_PATHS.DASHBOARD.QUOTATION.ROOT, element: <QuotationPage /> },
                { path: ROUTES_PATHS.DASHBOARD.QUOTATION.ITEM, element: <QuotationItemPage /> },
                { path: ROUTES_PATHS.DASHBOARD.QUOTATION.COMBINED, element: <CombinedQuotationPage /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE_INVOICE.ROOT, element: <SaleInvoicePage /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE_INVOICE.ITEM, element: <SaleInvoiceItemPage /> },
                { path: ROUTES_PATHS.DASHBOARD.SALE_INVOICE.COMBINED, element: <CombinedSaleInvoicePage /> }
            ],
        },
        { path: '*', element: <NotFound /> },
    ]

export default appRoutes