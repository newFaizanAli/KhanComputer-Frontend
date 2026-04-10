// pdf/DocumentPDF.tsx

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { C, ITEM_COLS, ITEM_COLS_NO_TAX, fmt, fmtDate, safe, pdf_style } from "./config";
import type { NormalizedDocumentData } from "../types";

// ── Safe info-box line builder ───────────────────────────────────────────────
const line = (label: string, value: unknown) =>
    value ? { text: `${label}${String(value)}` } : null;

const bold = (value: unknown) =>
    ({ text: safe(value), bold: true });

// ── Info box ─────────────────────────────────────────────────────────────────
const InfoBox: React.FC<{
    title: string;
    lines: ({ text: string; bold?: boolean } | null | undefined)[];
}> = ({ title, lines }) => {
    const safeLines = lines.filter(Boolean) as { text: string; bold?: boolean }[];
    return (
        <View style={pdf_style.infoBox}>
            <Text style={pdf_style.infoTitle}>{title}</Text>
            <View style={pdf_style.infoBody}>
                {safeLines.length === 0 ? (
                    <Text style={pdf_style.infoLine}>—</Text>
                ) : (
                    safeLines.map((l, i) => (
                        <Text key={i} style={l.bold ? pdf_style.infoName : pdf_style.infoLine}>
                            {safe(l.text)}
                        </Text>
                    ))
                )}
            </View>
        </View>
    );
};

// ── Payment status badge colour ───────────────────────────────────────────────
const paymentStatusColor = (status: string | null | undefined): string => {
    switch ((status ?? "").toLowerCase()) {
        case "paid": return "#16a34a";
        case "partial": return "#d97706";
        case "unpaid":
        default: return "#dc2626";
    }
};

// ── Main component ───────────────────────────────────────────────────────────
const DocumentPDF: React.FC<{ data: NormalizedDocumentData }> = ({ data }) => {

    const docType = data.docType ?? "QUOTATION";
    const meta = data.meta ?? { code: "—", date: "", thirdField: { label: "—", value: "—" } };
    const customer = data.customer ?? null;
    const store = data.store ?? null;
    const items = data.items ?? [];
    const discount = Number(data.discount ?? 0);
    const gst = Number(data.gst ?? 0);
    const notes = data.notes ?? "";
    const isTaxInclusive = data.is_tax_inclusive === true;
    const payment_method = data.payment_method ?? null;
    const payment_reference = data.payment_reference ?? null;
    const payment_status = data.payment_status ?? null;
    const quotation_code = data.quotation_code ?? null;

    const isInvoice = docType === "INVOICE";
    const isGeneralInvoice = docType === "GENERAL_INVOICE";
    const isQuotation = docType === "QUOTATION";

    // showTax: false for general invoice (never has tax) and tax-inclusive invoices
    const showTax = !isGeneralInvoice && !isTaxInclusive;

    // ── Totals ────────────────────────────────────────────────────────────────
    const totals = items.reduce((acc, item) => {
        const qty = Number(item?.quantity || 0);
        const price = Number(item?.price || 0);
        const base = qty * price;
        const discPercent = Number(item?.discount || 0);
        const gstPercent = Number(item?.gst || 0);
        const discAmount = (base * discPercent) / 100;
        const afterDisc = base - discAmount;
        const gstAmount = showTax ? (afterDisc * gstPercent) / 100 : 0;
        acc.subtotal += base;
        acc.itemDiscount += discAmount;
        acc.itemGST += gstAmount;
        return acc;
    }, { subtotal: 0, itemDiscount: 0, itemGST: 0 });

    const headerDiscount = Number(discount || 0);
    const headerGST = showTax ? Number(gst || 0) : 0;
    const afterHeaderDiscount = totals.subtotal - totals.itemDiscount - headerDiscount;
    const headerGSTAmount = (afterHeaderDiscount * headerGST) / 100;

    const grandTotal = showTax
        ? afterHeaderDiscount + totals.itemGST + headerGSTAmount
        : afterHeaderDiscount;

    const storeNotes = isInvoice
        ? store?.sale_invoice_notes
        : isQuotation
            ? store?.quotation_notes
            : null;    // general invoice has no dedicated store notes field
    const allNotes = [notes, store?.notes].filter(Boolean).join("\n\n");
    const contactLine = [store?.address, store?.phone, store?.email]
        .filter(Boolean).join("   |   ") || "—";

    // ── Info lines ────────────────────────────────────────────────────────────
    const billLines = [
        bold(customer?.name),
        line("", customer?.address),
        line("Phone: ", customer?.phone),
        line("Email: ", customer?.email),
        ...(showTax ? [
            line("GST No: ", customer?.gst),
            line("NTN: ", customer?.ntn),
        ] : []),
    ];

    const fromLines = [
        bold(store?.name),
        line("", store?.address),
        line("Phone: ", store?.phone),
        line("Email: ", store?.email),
        ...(showTax ? [
            line("GST No: ", store?.gst_no),
            line("NTN: ", store?.ntn),
        ] : []),
    ];

    // ── Meta strip ────────────────────────────────────────────────────────────
    const docLabel = isGeneralInvoice ? "SALE NO." : isInvoice ? "INVOICE NO." : "QUOTATION NO.";
    const metaItems = [
        { label: docLabel, value: safe(meta?.code) || "—" },
        { label: "ISSUE DATE", value: fmtDate(meta?.date) },
        { label: safe(meta?.thirdField?.label), value: safe(meta?.thirdField?.value) },
        ...(isInvoice && quotation_code
            ? [{ label: "QUOTATION REF.", value: safe(quotation_code) }]
            : []),
    ];

    // ── Table columns — no GST column for general invoice ────────────────────
    const columns = showTax ? ITEM_COLS : ITEM_COLS_NO_TAX;

    const itemCellValues = (item: typeof items[number], idx: number): string[] => {
        const desc = safe(item?.description);
        const note = item?.notes ? ` — ${safe(item.notes)}` : "";
        if (showTax) {
            return [
                String(idx + 1),
                desc + note,
                safe(item?.uom) === "—" ? "—" : safe(item?.uom),
                fmt(item?.quantity),
                `PKR ${fmt(item?.price)}`,
                `${fmt(item?.discount)}%`,
                `${fmt(item?.gst)}%`,
                `PKR ${fmt(item?.total)}`,
            ];
        }
        // No tax columns for general invoice or tax-inclusive
        return [
            String(idx + 1),
            desc + note,
            safe(item?.uom) === "—" ? "—" : safe(item?.uom),
            fmt(item?.quantity),
            `PKR ${fmt(item?.price)}`,
            `${fmt(item?.discount)}%`,
            `PKR ${fmt(item?.total)}`,
        ];
    };

    // ── Totals rows — no GST rows for general invoice ─────────────────────────
    const totalRows = [
        { label: "Subtotal", val: `PKR ${fmt(totals.subtotal)}` },
        { label: "Item Discount", val: `- PKR ${fmt(totals.itemDiscount)} (${items.length ? "varies per item" : "0%"})` },
        ...(showTax ? [{ label: "Item GST", val: `+ PKR ${fmt(totals.itemGST)} (${items.length ? "varies per item" : "0%"})` }] : []),
        { label: "Header Discount", val: `- PKR ${fmt(headerDiscount)} (${fmt(discount)}%)` },
        ...(showTax ? [{ label: "Header GST", val: `+ PKR ${fmt(headerGSTAmount)} (${fmt(gst)}%)` }] : []),
    ];

    // ── Payment block ─────────────────────────────────────────────────────────
    // Show for regular invoice AND general invoice (both can have payment info)
    const hasPaymentInfo = (isInvoice || isGeneralInvoice) &&
        (!!payment_method || !!payment_reference || !!payment_status);

    // ── Badge colours ─────────────────────────────────────────────────────────
    // General invoice uses the same accent color as regular invoice
    const badgeColor = isQuotation ? C.brand : C.invoiceAccent;
    const badgeLabel = isQuotation ? "QUOTATION" : "INVOICE";
    const badgeSubLabel = isGeneralInvoice ? "GENERAL SALE" : isInvoice ? "SALES INVOICE" : "PRICE QUOTATION";

    return (
        <Document>
            <Page size="A4" style={pdf_style.page}>

                {/* ── HEADER ──────────────────────────────────────────────── */}
                <View style={pdf_style.header}>
                    <View style={pdf_style.headerLeft}>
                        <Text style={pdf_style.companyName}>
                            {safe(store?.name) === "—" ? "Company Name" : safe(store?.name)}
                        </Text>
                        <Text style={pdf_style.tagline}>ELECTRONICS & IOT SOLUTIONS</Text>
                        <Text style={pdf_style.contactLine}>{contactLine}</Text>
                    </View>

                    <View style={[pdf_style.badge, { backgroundColor: badgeColor }]}>
                        <Text style={pdf_style.badgeText}>{badgeLabel}</Text>
                        <Text style={pdf_style.badgeSubText}>{badgeSubLabel}</Text>
                        {/* TAX INCLUSIVE label only shown for regular tax-inclusive invoices */}
                        {isInvoice && isTaxInclusive && (
                            <Text style={[pdf_style.badgeSubText, {
                                marginTop: 4,
                                backgroundColor: "rgba(255,255,255,0.15)",
                                borderRadius: 2,
                                paddingHorizontal: 4,
                                paddingVertical: 1,
                            }]}>
                                TAX INCLUSIVE
                            </Text>
                        )}
                    </View>
                </View>

                {/* ── META STRIP ──────────────────────────────────────────── */}
                <View style={pdf_style.metaStrip}>
                    {metaItems.map((m, i) => (
                        <React.Fragment key={i}>
                            {i > 0 && <View style={pdf_style.metaDivider} />}
                            <View style={pdf_style.metaItem}>
                                <Text style={[pdf_style.metaLabel, { marginLeft: i === 0 ? 0 : 10 }]}>
                                    {m.label}
                                </Text>
                                <Text style={[pdf_style.metaValue, { marginLeft: i === 0 ? 0 : 10 }]}>
                                    {m.value}
                                </Text>
                            </View>
                        </React.Fragment>
                    ))}
                </View>

                {/* ── BILL TO / FROM ───────────────────────────────────────── */}
                <View style={pdf_style.infoRow}>
                    <InfoBox title="BILL TO" lines={billLines} />
                    {!isGeneralInvoice && <InfoBox title="FROM" lines={fromLines} />}
                </View>

                {/* ── PAYMENT DETAILS ──────────────────────────────────────── */}
                {hasPaymentInfo && (
                    <View style={pdf_style.paymentRow}>
                        {!!payment_method && (
                            <View style={pdf_style.paymentItem}>
                                <Text style={pdf_style.paymentLabel}>PAYMENT METHOD</Text>
                                <Text style={pdf_style.paymentValue}>
                                    {safe(payment_method).replace(/_/g, " ").toUpperCase()}
                                </Text>
                            </View>
                        )}
                        {!!payment_reference && (
                            <View style={[
                                pdf_style.paymentItem,
                                payment_method ? pdf_style.paymentItemBordered : {},
                            ]}>
                                <Text style={pdf_style.paymentLabel}>PAYMENT REFERENCE</Text>
                                <Text style={pdf_style.paymentValue}>{safe(payment_reference)}</Text>
                            </View>
                        )}
                        {/* payment_status only shown for regular invoices */}
                        {isInvoice && !!payment_status && (
                            <View style={[
                                pdf_style.paymentItem,
                                (payment_method || payment_reference) ? pdf_style.paymentItemBordered : {},
                            ]}>
                                <Text style={pdf_style.paymentLabel}>PAYMENT STATUS</Text>
                                <View style={[
                                    pdf_style.statusBadge,
                                    { backgroundColor: paymentStatusColor(payment_status) },
                                ]}>
                                    <Text style={pdf_style.statusBadgeText}>
                                        {safe(payment_status).replace(/_/g, " ").toUpperCase()}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}

                {/* ── ITEMS TABLE ─────────────────────────────────────────── */}
                <View style={pdf_style.tableWrap}>
                    <View style={pdf_style.tableHead}>
                        {columns.map((col) => (
                            <Text
                                key={col.label}
                                style={[pdf_style.tableHeadCell, { flex: col.flex, textAlign: col.align }]}
                            >
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {items.length === 0 ? (
                        <View style={[pdf_style.tableRow, { backgroundColor: C.brandX, justifyContent: "center" }]}>
                            <Text style={{ fontSize: 8, color: C.muted }}>No items found.</Text>
                        </View>
                    ) : (
                        items.map((item, idx) => {
                            const vals = itemCellValues(item, idx);
                            return (
                                <View
                                    key={item?.id ?? idx}
                                    style={[pdf_style.tableRow, {
                                        backgroundColor: idx % 2 === 0 ? C.white : C.brandX,
                                    }]}
                                >
                                    {columns.map((col, ci) => (
                                        <Text
                                            key={ci}
                                            style={[pdf_style.tableCell, { flex: col.flex, textAlign: col.align }]}
                                        >
                                            {vals[ci]}
                                        </Text>
                                    ))}
                                </View>
                            );
                        })
                    )}
                </View>

                {/* ── TOTALS ──────────────────────────────────────────────── */}
                <View style={pdf_style.totalsWrap}>
                    <View style={pdf_style.totalsInner}>
                        {totalRows.map((row) => (
                            <View key={row.label} style={pdf_style.totalRow}>
                                <Text style={pdf_style.totalLabel}>{row.label}</Text>
                                <Text style={pdf_style.totalVal}>{row.val}</Text>
                            </View>
                        ))}
                        <View style={pdf_style.grandBar}>
                            <Text style={pdf_style.grandLabel}>GRAND TOTAL</Text>
                            <Text style={pdf_style.grandVal}>PKR {fmt(grandTotal)}</Text>
                        </View>
                    </View>
                </View>

                {/* ── NOTES ───────────────────────────────────────────────── */}
                {storeNotes ? (
                    <View style={pdf_style.notesWrap}>
                        <Text style={pdf_style.notesTitle}>
                            {isGeneralInvoice ? "SALE NOTES" : isInvoice ? "INVOICE NOTES" : "QUOTATION NOTES"}
                        </Text>
                        <Text style={pdf_style.notesBody}>{storeNotes}</Text>
                    </View>
                ) : null}

                {allNotes ? (
                    <View style={pdf_style.notesWrap}>
                        <Text style={pdf_style.notesTitle}>NOTES & TERMS</Text>
                        <Text style={pdf_style.notesBody}>{allNotes}</Text>
                    </View>
                ) : null}

                {/* ── FOOTER ──────────────────────────────────────────────── */}
                <View style={pdf_style.footer} fixed>
                    <Text style={pdf_style.footerLeft}>
                        {isGeneralInvoice
                            ? `Ref: ${safe(meta?.thirdField?.value)}. All prices in PKR — no tax applied.`
                            : isInvoice
                                ? `Invoice Ref: ${safe(meta?.thirdField?.value)}. All prices in PKR${isTaxInclusive ? " — tax inclusive." : " inclusive of applicable taxes."}`
                                : `Quotation valid until ${fmtDate(meta?.thirdField?.value)}. Prices subject to change. E&OE.`
                        }
                    </Text>
                    <Text style={pdf_style.footerRight}>
                        {safe(store?.name) === "—" ? "" : safe(store?.name)}
                        {meta?.code ? `   •   ${safe(meta.code)}` : ""}
                    </Text>
                </View>

            </Page>
        </Document>
    );
};

export default DocumentPDF;