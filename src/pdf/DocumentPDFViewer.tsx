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
} from "../types";

// ── Adapters (inlined — no external import needed) ───────────────────────────

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
        thirdField: {
            label: "VALID UNTIL",
            value: quotation?.valid_until ?? "—",
        },
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
        thirdField: {
            label: "ORDER REF. NO.",
            value: invoice?.order_reference_no ?? "—",
        },
    },
    customer: customer ?? null,
    store: store ?? null,
    items: items ?? [],
    discount: Number(invoice?.discount ?? 0),
    gst: Number(invoice?.gst ?? 0),
    notes: invoice?.notes ?? "",
    is_tax_inclusive: invoice?.is_tax_inclusive ?? false,
    // Extra invoice-only fields
    payment_method: invoice?.payment_method ?? null,
    payment_reference: invoice?.payment_reference ?? null,
    payment_status: invoice?.payment_status ?? null,
    quotation_code: invoice?.quotationCode ?? null,
});

// ── Types ────────────────────────────────────────────────────────────────────

type DocVariant = "quotation" | "invoice";

interface Props {
    id: string;
    variant: DocVariant;
    previewUrl: string;
    onClose: () => void;
}

const LABELS: Record<DocVariant, string> = {
    quotation: "Quotation Preview",
    invoice: "Invoice Preview",
};

// ── Component ────────────────────────────────────────────────────────────────

const DocumentPDFViewer: React.FC<Props> = ({ id, variant, previewUrl, onClose }) => {
    const [data, setData] = useState<NormalizedDocumentData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                setData(null);

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

                const normalized: NormalizedDocumentData =
                    variant === "quotation"
                        ? fromQuotation(d.quotation, d.customer ?? null, d.store ?? null, d.items ?? [])
                        : fromInvoice(d.invoice, d.customer ?? null, d.store ?? null, d.items ?? []);

                setData(normalized);

            } catch (err: unknown) {
                if (err instanceof Error && (err.name === "CanceledError" || err.name === "AbortError")) return;
                setError(err instanceof Error ? err.message : "An unexpected error occurred.");
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchData();
        return () => controller.abort();

    }, [id, variant, previewUrl]);

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
                            onClick={() => { setError(null); setLoading(true); setData(null); }}
                            style={{ padding: "6px 18px", backgroundColor: "#1a3c5e", color: "#fff", border: "1px solid #00b4d8", borderRadius: 4, cursor: "pointer", fontSize: 13 }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && data && (
                    <PDFViewer width="100%" height="100%" showToolbar>
                        <DocumentPDF data={data} />
                    </PDFViewer>
                )}
            </div>
        </div>
    );
};

export default DocumentPDFViewer;