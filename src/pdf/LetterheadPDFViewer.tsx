
import React, { useEffect, useState } from "react";
import { PDFViewer } from "@react-pdf/renderer";
import api from "../utilities/api";
import LetterheadPDF from "./LetterheadPDF";
import type { NormalizedLetterheadData, LetterHead, StoreInfo } from "../types";

// ── Adapter ───────────────────────────────────────────────────────────────────


const fromLetterhead = (
    letterhead: LetterHead,
    store: StoreInfo | null,
    body?: string | null,
): NormalizedLetterheadData => ({
    letterhead: {
        id: letterhead?.id ?? undefined,
        code: letterhead?.code ?? "—",
        store_id: letterhead?.store_id ?? undefined,
        name: letterhead?.name ?? "—",
        header_text: letterhead?.header_text ?? "",
        footer_text: letterhead?.footer_text ?? "",
        default_body: letterhead?.default_body ?? "",
        notes: letterhead?.notes ?? "",
        issued_at: letterhead?.issued_at ?? "",
    },
    store: store ?? null,
    body: body ?? letterhead?.default_body ?? null,
});

// ── Types ─────────────────────────────────────────────────────────────────────

interface Props {
    id: string;
    /** Base URL of the letterhead preview endpoint, e.g. "/api/letterheads" */
    previewUrl: string;
    onClose: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const LetterheadPDFViewer: React.FC<Props> = ({ id, previewUrl, onClose }) => {
    const [data, setData] = useState<NormalizedLetterheadData | null>(null);
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
                    throw new Error(res?.data?.message || "Failed to load letterhead.");
                }

                const d = res.data.data;

                if (!d?.letterhead) {
                    throw new Error("Letterhead data missing in response.");
                }

                const normalized = fromLetterhead(
                    d.letterhead,
                    d.store ?? null,
                    d.body ?? null,
                );

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

    }, [id, previewUrl]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.65)",
                zIndex: 9999,
                display: "flex",
                flexDirection: "column",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            {/* ── Toolbar ─────────────────────────────────────────────────── */}
            <div style={{
                height: 48,
                backgroundColor: "#1a3c5e",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                paddingInline: 20,
                flexShrink: 0,
            }}>
                <span style={{ color: "#d6e8f7", fontWeight: 600, fontSize: 14 }}>
                    Letterhead Preview
                </span>
                <button
                    onClick={onClose}
                    aria-label="Close preview"
                    style={{
                        background: "none",
                        border: "none",
                        color: "#ffffff",
                        fontSize: 22,
                        cursor: "pointer",
                        lineHeight: 1,
                    }}
                >
                    ✕
                </button>
            </div>

            {/* ── Content ─────────────────────────────────────────────────── */}
            <div style={{ flex: 1, overflow: "hidden" }}>

                {loading && (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        gap: 12,
                    }}>
                        <div style={{
                            width: 32,
                            height: 32,
                            border: "3px solid rgba(255,255,255,0.2)",
                            borderTopColor: "#00b4d8",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                        }} />
                        <span style={{ color: "#d6e8f7", fontSize: 14 }}>
                            Loading Letterhead…
                        </span>
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                )}

                {!loading && error && (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "100%",
                        gap: 12,
                    }}>
                        <span style={{ color: "#f87171", fontSize: 15 }}>⚠ {error}</span>
                        <button
                            onClick={() => { setError(null); setLoading(true); setData(null); }}
                            style={{
                                padding: "6px 18px",
                                backgroundColor: "#1a3c5e",
                                color: "#fff",
                                border: "1px solid #00b4d8",
                                borderRadius: 4,
                                cursor: "pointer",
                                fontSize: 13,
                            }}
                        >
                            Retry
                        </button>
                    </div>
                )}

                {!loading && !error && data && (
                    <PDFViewer width="100%" height="100%" showToolbar>
                        <LetterheadPDF data={data} />
                    </PDFViewer>
                )}
            </div>
        </div>
    );
};

export default LetterheadPDFViewer;