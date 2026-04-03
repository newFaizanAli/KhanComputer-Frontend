// pdf/DocumentPDF.tsx

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { C, ITEM_COLS, fmt, fmtDate, safe, pdf_style } from "./config";
import type { NormalizedDocumentData } from "../types";


// ── Safe info-box line builder ───────────────────────────────────────────────
// Returns nothing if value is empty — so the line is completely omitted
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

// ── Main component ───────────────────────────────────────────────────────────
const DocumentPDF: React.FC<{ data: NormalizedDocumentData }> = ({ data }) => {

    // Guard the entire data object — never trust what comes from the API
    const {
        docType = "QUOTATION",
        meta = { code: "—", date: "", thirdField: { label: "—", value: "—" } },
        customer = null,
        store = null,
        items = [],
        discount = 0,
        gst = 0,
        notes = "",
    } = data ?? {};

    const isInvoice = docType === "INVOICE";

    // ── Totals (all guarded by fmt which defaults to 0) ──────────────────────
    const subtotal = items.reduce((s, i) => s + Number(i?.price || 0) * Number(i?.quantity || 0), 0);
    const itemDisc = items.reduce((s, i) => s + Number(i?.discount || 0), 0);
    const itemGst = items.reduce((s, i) => s + Number(i?.gst || 0), 0);
    const grandTotal = subtotal - itemDisc + itemGst - Number(discount) + Number(gst);

    const storeNotes = isInvoice ? store?.sale_invoice_notes : store?.quotation_notes;
    const allNotes = [notes, store?.notes].filter(Boolean).join("\n\n");

    const contactLine = [store?.address, store?.phone, store?.email]
        .filter(Boolean)
        .join("   |   ") || "—";

    // ── Info lines — null entries are filtered out in <InfoBox> ─────────────
    const billLines = [
        bold(customer?.name),
        line("", customer?.address),
        line("Phone: ", customer?.phone),
        line("Email: ", customer?.email),
        line("GST No: ", customer?.gst),
        line("NTN: ", customer?.ntn),
    ];

    const fromLines = [
        bold(store?.name),
        line("", store?.address),
        line("Phone: ", store?.phone),
        line("Email: ", store?.email),
        line("GST No: ", store?.gst_no),
        line("NTN: ", store?.ntn),
    ];

    // ── Meta strip items ─────────────────────────────────────────────────────
    const metaItems = [
        { label: isInvoice ? "INVOICE NO." : "QUOTATION NO.", value: safe(meta?.code) },
        { label: "ISSUE DATE", value: fmtDate(meta?.date) },
        { label: safe(meta?.thirdField?.label), value: safe(meta?.thirdField?.value) },

    ];

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

                    <View style={[pdf_style.badge, { backgroundColor: isInvoice ? C.invoiceAccent : C.brand }]}>
                        <Text style={pdf_style.badgeText}>
                            {isInvoice ? "INVOICE" : "QUOTATION"}
                        </Text>
                        <Text style={pdf_style.badgeSubText}>
                            {isInvoice ? "SALES INVOICE" : "PRICE QUOTATION"}
                        </Text>
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
                    <InfoBox title="FROM" lines={fromLines} />


                </View>




                {/* ── ITEMS TABLE ─────────────────────────────────────────── */}
                <View style={pdf_style.tableWrap}>
                    <View style={pdf_style.tableHead}>
                        {ITEM_COLS.map((col) => (
                            <Text
                                key={col.label}
                                style={[pdf_style.tableHeadCell, { flex: col.flex, textAlign: col.align }]}
                            >
                                {col.label}
                            </Text>
                        ))}
                    </View>

                    {!items || items.length === 0 ? (
                        <View style={[pdf_style.tableRow, { backgroundColor: C.brandX, justifyContent: "center" }]}>
                            <Text style={{ fontSize: 8, color: C.muted }}>No items found.</Text>
                        </View>
                    ) : (
                        items.map((item, idx) => {
                            // Guard every single item field
                            const desc = safe(item?.description);
                            const note = item?.notes ? ` — ${safe(item.notes)}` : "";
                            const vals = [
                                String(idx + 1),
                                desc + note,
                                safe(item?.uom) === "—" ? "—" : safe(item?.uom),
                                fmt(item?.quantity),
                                `PKR ${fmt(item?.price)}`,
                                `${fmt(item?.discount)}%`,
                                `${fmt(item?.gst)}%`,
                                `PKR ${fmt(item?.total)}`,
                            ];
                            return (
                                <View
                                    key={item?.id ?? idx}
                                    style={[pdf_style.tableRow, {
                                        backgroundColor: idx % 2 === 0 ? C.white : C.brandX,
                                    }]}
                                >
                                    {ITEM_COLS.map((col, ci) => (
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
                        {[
                            { label: "Subtotal", val: `PKR ${fmt(subtotal)}` },
                            { label: "Item Discounts", val: `- ${fmt(itemDisc)}%` },
                            { label: "Item GST", val: `+ ${fmt(itemGst)}%` },
                            { label: "Header Discount", val: `- PKR ${fmt(discount)}` },
                            { label: "Header GST", val: `+ PKR ${fmt(gst)}` },
                        ].map((row) => (
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

                {
                    storeNotes ? (
                        <View style={pdf_style.notesWrap}>
                            <Text style={pdf_style.notesTitle}>{isInvoice ? "INVOICE NOTES" : "QUOTATION NOTES"}</Text>
                            <Text style={pdf_style.notesBody}>{storeNotes}</Text>
                        </View>
                    ) : null
                }

                {allNotes ? (
                    <View style={pdf_style.notesWrap}>
                        <Text style={pdf_style.notesTitle}>NOTES & TERMS</Text>
                        <Text style={pdf_style.notesBody}>{allNotes}</Text>
                    </View>
                ) : null}


                {/* ── FOOTER ──────────────────────────────────────────────── */}
                <View style={pdf_style.footer} fixed>
                    <Text style={pdf_style.footerLeft}>
                        {isInvoice
                            ? `Invoice Ref: ${safe(meta?.thirdField?.value)}. All prices in PKR inclusive of applicable taxes.`
                            : `Quotation valid until ${fmtDate(meta?.thirdField?.value)}. Prices subject to change. E&OE.`
                        }
                    </Text>
                    <Text style={pdf_style.footerRight}>
                        {safe(store?.name) === "—" ? "" : safe(store?.name)}   •   {safe(meta?.code)}
                    </Text>
                </View>

            </Page>
        </Document>
    );
};

export default DocumentPDF;