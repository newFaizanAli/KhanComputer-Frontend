// pdf/DocumentPDFViewer.tsx

import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import api from "../utilities/api";
import DocumentPDF from "./DocumentPDF";
import type {
    NormalizedDocumentData,
    Customer, StoreInfo,
    Quotation, QuotationItem,
    SaleInvoice, SaleInvoiceItem,
    GeneralSaleInvoiceData,
} from "../types";

// ── Adapters ─────────────────────────────────────────────────────────────────

const fromQuotation = (
    quotation: Quotation,
    customer: Customer | null,
    store: StoreInfo | null,
    items: QuotationItem[]
): NormalizedDocumentData => ({
    docType: "QUOTATION",
    meta: {
        code: quotation?.code ?? "—",
        date: quotation?.date ?? "",
        thirdField: { label: "VALID UNTIL", value: quotation?.valid_until ?? "—" },
    },
    customer: customer ?? null,
    store: store ?? null,
    items: items ?? [],
    discount: Number(quotation?.discount ?? 0),
    gst: Number(quotation?.gst ?? 0),
    notes: quotation?.notes ?? "",
    is_tax_inclusive: false,
});

const fromInvoice = (
    invoice: SaleInvoice,
    customer: Customer | null,
    store: StoreInfo | null,
    items: SaleInvoiceItem[]
): NormalizedDocumentData => ({
    docType: "INVOICE",
    meta: {
        code: invoice?.code ?? "—",
        date: invoice?.date ?? "",
        thirdField: { label: "ORDER REF. NO.", value: invoice?.order_reference_no ?? "—" },
    },
    customer: customer ?? null,
    store: store ?? null,
    items: items ?? [],
    discount: Number(invoice?.discount ?? 0),
    gst: Number(invoice?.gst ?? 0),
    notes: invoice?.notes ?? "",
    is_tax_inclusive: invoice?.is_tax_inclusive ?? false,
    payment_method: invoice?.payment_method ?? null,
    payment_reference: invoice?.payment_reference ?? null,
    payment_status: invoice?.payment_status ?? null,
    quotation_code: invoice?.quotationCode ?? null,
});

// ── General sale invoice adapter — no backend fetch, raw form data ─────────
const fromGeneralSaleInvoice = (
    raw: GeneralSaleInvoiceData,
    store: StoreInfo | null,
): NormalizedDocumentData => ({
    docType: "GENERAL_INVOICE",
    meta: {
        code: "",                           // no stored code
        date: raw.date ?? "",
        thirdField: {
            label: "ORDER REF. NO.",
            value: raw.order_reference_no || "—",
        },
    },
    // Build a minimal customer shape from the raw fields
    customer: {
        name: raw.customerName ?? "",
        phone: raw.customerPhno ?? null,
        address: "",
        email: "",
        gst: '',
        ntn: "",
    } as Customer,
    store: store ?? null,
    items: (raw.items ?? []).map(item => ({
        ...item,
        gst: 0,             // no tax on general invoices
    })),
    discount: Number(raw.discount ?? 0),
    gst: 0,                 // no order-level GST
    notes: raw.notes ?? "",
    is_tax_inclusive: false,
    payment_method: raw.payment_method ?? null,
    payment_reference: raw.payment_reference ?? null,
    payment_status: null,   // general invoice has no payment_status
    quotation_code: null,
});

// ── Types ────────────────────────────────────────────────────────────────────

type DocVariant = "quotation" | "invoice" | "general-invoice";

interface BaseProps {
    variant: DocVariant;
    onClose: () => void;
    store?: StoreInfo | null;       // pass in for general-invoice (already in scope)
}

// Fetched variants need an id + previewUrl
interface FetchedProps extends BaseProps {
    variant: "quotation" | "invoice";
    id: string;
    previewUrl: string;
    data?: never;
}

// General invoice is passed directly — no fetch
interface DirectProps extends BaseProps {
    variant: "general-invoice";
    data: GeneralSaleInvoiceData;
    id?: never;
    previewUrl?: never;
}

type Props = FetchedProps | DirectProps;

const LABELS: Record<DocVariant, string> = {
    quotation: "Quotation Preview",
    invoice: "Invoice Preview",
    "general-invoice": "General Sale Invoice Preview",
};

// ── Component ────────────────────────────────────────────────────────────────

const DocumentPDFViewer: React.FC<Props> = (props) => {
    const { variant, onClose, store = null } = props;

    const [normalizedData, setNormalizedData] = useState<NormalizedDocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ── General invoice: normalize immediately, no fetch needed ──────────
        if (variant === "general-invoice") {
            const { data } = props as DirectProps;
            setNormalizedData(fromGeneralSaleInvoice(data, store));
            setLoading(false);
            return;
        }

        // ── Fetched variants ─────────────────────────────────────────────────
        const { id, previewUrl } = props as FetchedProps;
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setNormalizedData(null);

                const res = await api.get(`${previewUrl}/preview/${id}`, {
                    signal: controller.signal,
                });

                if (!res?.data?.success) {
                    throw new Error(res?.data?.message || "Failed to load document.");
                }

                const d = res.data.data;

                if (variant === "quotation" && !d?.quotation) {
                    throw new Error("Quotation data missing in response.");
                }
                if (variant === "invoice" && !d?.invoice) {
                    throw new Error("Invoice data missing in response.");
                }

                setNormalizedData(
                    variant === "quotation"
                        ? fromQuotation(d.quotation, d.customer ?? null, d.store ?? null, d.items ?? [])
                        : fromInvoice(d.invoice, d.customer ?? null, d.store ?? null, d.items ?? [])
                );
            } catch (err: unknown) {
                if (err instanceof Error && (err.name === "CanceledError" || err.name === "AbortError")) return;
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();

    }, [variant]);      // variant is stable; direct data changes handled by caller remounting

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.65)", zIndex: 9999, display: "flex", flexDirection: "column" }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* Toolbar */}
            <div style={{ height: 48, backgroundColor: "#1a3c5e", display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: 20, flexShrink: 0 }}>
                <span style={{ color: "#d6e8f7", fontWeight: 600, fontSize: 14 }}>
                    {LABELS[variant] ?? "Document Preview"}
                </span>
                <button
                    onClick={onClose}
                    aria-label="Close preview"
                    style={{ background: "none", border: "none", color: "#ffffff", fontSize: 22, cursor: "pointer", lineHeight: 1 }}
                >
                    ✕
                </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: "hidden" }}>
                {loading && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                        <div style={{ width: 32, height: 32, border: "3px solid rgba(255,255,255,0.2)", borderTopColor: "#00b4d8", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                        <span style={{ color: "#d6e8f7", fontSize: 14 }}>Loading {LABELS[variant]}…</span>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {!loading && error && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 12 }}>
                        <span style={{ color: "#f87171", fontSize: 15 }}>⚠ {error}</span>
                        <button
                            onClick={() => { setError(null); setLoading(true); setNormalizedData(null); }}
                            style={{ padding: "6px 18px", backgroundColor: "#1a3c5e", color: "#fff", border: "1px solid #00b4d8", borderRadius: 4, cursor: "pointer", fontSize: 13 }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && normalizedData && (
                    <PDFViewer width="100%" height="100%" showToolbar>
                        <DocumentPDF data={normalizedData} />
                    </PDFViewer>
                )}
            </div>
        </div>
    );
};

export default DocumentPDFViewer;