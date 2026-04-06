// pdf/LetterheadPDF.tsx

import React from "react";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { C, fmtDate, safe, pdf_style } from "./config";
import { StyleSheet } from "@react-pdf/renderer";
import type { NormalizedLetterheadData } from "../types/pdf";

// ── Main component ────────────────────────────────────────────────────────────
const LetterheadPDF: React.FC<{ data: NormalizedLetterheadData }> = ({ data }) => {

    const letterhead = data.letterhead ?? {};
    const store = data.store ?? null;
    const body = data.body || letterhead.default_body || "";

    // ── Contact line (header area below company name) ─────────────────────────
    const contactLine = [store?.address, store?.phone, store?.email,]
        .filter(Boolean)
        .join("   |   ") || "—";

    // ── Store identity lines for the FROM box ─────────────────────────────────
    const storeLines: { text: string; bold?: boolean }[] = [
        { text: safe(store?.name), bold: true },
        ...[store?.address, store?.phone, store?.email, store?.gst_no, store?.ntn]
            .filter(Boolean)
            .map((v) => ({ text: String(v) })),
    ];

    // ── Issue date ────────────────────────────────────────────────────────────
    const issuedAt = fmtDate(letterhead.issued_at);

    return (
        <Document>
            <Page size="A4" style={lh_style.page}>

                {/* ══ LETTERHEAD HEADER ══════════════════════════════════════ */}
                <View style={lh_style.header}>
                    {/* Left: company branding */}
                    <View style={lh_style.headerLeft}>
                        <Text style={lh_style.companyName}>
                            {safe(store?.name) === "—" ? "Company Name" : safe(store?.name)}
                        </Text>
                        <Text style={lh_style.tagline}>ELECTRONICS & IOT SOLUTIONS</Text>
                        <Text style={lh_style.contactLine}>{contactLine}</Text>
                    </View>

                    {/* Right: letterhead type badge */}
                    <View style={[pdf_style.badge, { backgroundColor: C.invoiceAccent }]}>
                        <Text style={pdf_style.badgeText}>LETTER</Text>
                        <Text style={pdf_style.badgeSubText}>
                            {safe(letterhead.name).toUpperCase()}
                        </Text>
                    </View>
                </View>

                {/* ══ HEADER TEXT STRIP ══════════════════════════════════════ */}
                {!!letterhead.header_text && (
                    <View style={lh_style.headerStrip}>
                        <Text style={lh_style.headerStripText}>
                            {safe(letterhead.header_text)}
                        </Text>
                    </View>
                )}

                {/* ══ META ROW (code + date) ════════════════════════════════ */}
                <View style={lh_style.metaStrip}>
                    <View style={lh_style.metaItem}>
                        <Text style={lh_style.metaLabel}>REFERENCE NO.</Text>
                        <Text style={lh_style.metaValue}>{safe(letterhead.code)}</Text>
                    </View>
                    <View style={lh_style.metaDivider} />
                    <View style={lh_style.metaItem}>
                        <Text style={[lh_style.metaLabel, { marginLeft: 10 }]}>ISSUE DATE</Text>
                        <Text style={[lh_style.metaValue, { marginLeft: 10 }]}>{issuedAt}</Text>
                    </View>
                    <View style={lh_style.metaDivider} />
                    <View style={[lh_style.metaItem, { flex: 2 }]}>
                        <Text style={[lh_style.metaLabel, { marginLeft: 10 }]}>SUBJECT</Text>
                        <Text style={[lh_style.metaValue, { marginLeft: 10 }]}>
                            {safe(letterhead.header_text)}
                        </Text>
                    </View>
                </View>

                {/* ══ FROM BOX ════════════════════════════════════════════════ */}
                <View style={lh_style.fromRow}>
                    <View style={lh_style.fromBox}>
                        <Text style={lh_style.fromTitle}>FROM</Text>
                        <View style={lh_style.fromBody}>
                            {storeLines.map((l, i) => (
                                <Text
                                    key={i}
                                    style={l.bold ? pdf_style.infoName : pdf_style.infoLine}
                                >
                                    {safe(l.text)}
                                </Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* ══ BODY CONTENT ════════════════════════════════════════════ */}
                <View style={lh_style.bodyWrap}>
                    {body ? (
                        // Split on double newlines into paragraphs for nicer spacing
                        body.split(/\n\n+/).map((para, i) => (
                            <Text key={i} style={lh_style.bodyPara}>
                                {para.trim()}
                            </Text>
                        ))
                    ) : (
                        <Text style={lh_style.bodyPlaceholder}>
                            [ No body content provided ]
                        </Text>
                    )}
                </View>

                {/* ══ NOTES ════════════════════════════════════════════════════ */}
                {!!letterhead.notes && (
                    <View style={lh_style.notesWrap}>
                        <Text style={lh_style.notesTitle}>NOTES</Text>
                        <Text style={lh_style.notesBody}>{safe(letterhead.notes)}</Text>
                    </View>
                )}

                {/* ══ FOOTER TEXT STRIP ════════════════════════════════════════ */}
                {!!letterhead.footer_text && (
                    <View style={lh_style.footerTextWrap}>
                        <Text style={lh_style.footerTextBody}>
                            {safe(letterhead.footer_text)}
                        </Text>
                    </View>
                )}

                {/* ══ SIGNATURE BLOCK ══════════════════════════════════════════ */}
                <View style={lh_style.signatureRow}>
                    <View style={lh_style.signatureBox}>
                        <View style={lh_style.signatureLine} />
                        <Text style={lh_style.signatureLabel}>Authorised Signatory</Text>
                        <Text style={lh_style.signatureName}>
                            {safe(store?.name) === "—" ? "Company Name" : safe(store?.name)}
                        </Text>
                    </View>
                </View>

                {/* ══ PAGE FOOTER (fixed) ═══════════════════════════════════════ */}
                <View style={lh_style.footer} fixed>
                    <Text style={lh_style.footerLeft}>
                        {safe(letterhead.footer_text) !== "—"
                            ? safe(letterhead.footer_text)
                            : `${safe(store?.name)} — Confidential`}
                    </Text>
                    <Text style={lh_style.footerRight}>
                        {safe(store?.name) === "—" ? "" : safe(store?.name)}
                        {"   •   "}
                        {safe(letterhead.code)}
                    </Text>
                </View>

            </Page>
        </Document>
    );
};

// ── Letterhead-specific styles (extends / overrides pdf_style where needed) ───


const lh_style = StyleSheet.create({

    page: {
        fontFamily: "Helvetica",
        fontSize: 9,
        color: C.text,
        backgroundColor: C.white,
        paddingTop: 32,
        paddingBottom: 56,      // extra room for fixed footer
        paddingHorizontal: 36,
    },

    // ── Header (reuses same layout as DocumentPDF) ────────────────────────────
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 6,
        paddingBottom: 12,
        borderBottomWidth: 2,
        borderBottomColor: C.brand,
    },
    headerLeft: {
        flexDirection: "column",
        gap: 3,
    },
    companyName: {
        fontSize: 18,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 7.5,
        color: C.muted,
        letterSpacing: 1.5,
        marginTop: 1,
    },
    contactLine: {
        fontSize: 7.5,
        color: C.muted,
        marginTop: 3,
    },

    // ── Header text strip (subject / title of the letter) ────────────────────
    headerStrip: {
        backgroundColor: C.brand,
        borderRadius: 3,
        paddingVertical: 7,
        paddingHorizontal: 14,
        marginTop: 8,
        marginBottom: 0,
    },
    headerStripText: {
        fontSize: 9,
        fontFamily: "Helvetica-Bold",
        color: C.white,
        letterSpacing: 0.5,
    },

    // ── Meta strip ────────────────────────────────────────────────────────────
    metaStrip: {
        flexDirection: "row",
        backgroundColor: C.brandX,
        borderRadius: 3,
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginTop: 6,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: C.border,
    },
    metaItem: {
        flex: 1,
        flexDirection: "column",
    },
    metaLabel: {
        fontSize: 6.5,
        color: C.muted,
        letterSpacing: 0.8,
        marginBottom: 2,
    },
    metaValue: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.text,
    },
    metaDivider: {
        width: 1,
        backgroundColor: C.border,
        marginHorizontal: 4,
        marginVertical: 2,
    },

    // ── FROM box (single, left-aligned — no BILL TO on a letter) ─────────────
    fromRow: {
        flexDirection: "row",
        justifyContent: "flex-end", // move content to the right
        marginBottom: 16,
    },
    fromBox: {
        width: "50%",
        overflow: "hidden",
    },
    fromTitle: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
        // paddingVertical: 4,
        paddingHorizontal: 8,
        letterSpacing: 1.2,
    },
    fromBody: {
        padding: 8,
        // backgroundColor: C.lightBg,
    },

    // ── Body content area ─────────────────────────────────────────────────────
    bodyWrap: {
        flex: 1,
        marginBottom: 14,
        paddingHorizontal: 2,
    },
    bodyPara: {
        fontSize: 9,
        color: C.text,
        lineHeight: 1.7,
        marginBottom: 10,
        textAlign: "justify",
    },
    bodyPlaceholder: {
        fontSize: 8.5,
        color: C.muted,
        fontStyle: "italic",
        marginTop: 10,
    },

    // ── Notes block ───────────────────────────────────────────────────────────
    notesWrap: {
        borderWidth: 1,
        borderColor: C.border,
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 14,
    },
    notesTitle: {
        fontSize: 7,
        fontFamily: "Helvetica-Bold",
        color: C.white,
        backgroundColor: C.brandLight,
        paddingVertical: 4,
        paddingHorizontal: 8,
        letterSpacing: 1,
    },
    notesBody: {
        fontSize: 7.5,
        color: C.muted,
        padding: 8,
        lineHeight: 1.5,
        backgroundColor: C.lightBg,
    },

    // ── Footer text (e.g. disclaimer, terms) — above signature ───────────────
    footerTextWrap: {
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingTop: 8,
        marginBottom: 16,
    },
    footerTextBody: {
        fontSize: 7.5,
        color: C.muted,
        lineHeight: 1.5,
        textAlign: "justify",
    },

    // ── Signature block ───────────────────────────────────────────────────────
    signatureRow: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 14,
    },
    signatureBox: {
        width: 160,
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 4,
    },
    signatureLine: {
        width: "100%",
        height: 1,
        backgroundColor: C.text,
        marginBottom: 5,
        marginTop: 32,          // visual blank space above for actual signature
    },
    signatureLabel: {
        fontSize: 7,
        color: C.muted,
        letterSpacing: 0.5,
    },
    signatureName: {
        fontSize: 8,
        fontFamily: "Helvetica-Bold",
        color: C.brand,
    },

    // ── Fixed page footer ─────────────────────────────────────────────────────
    footer: {
        position: "absolute",
        bottom: 16,
        left: 36,
        right: 36,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderTopWidth: 1,
        borderTopColor: C.border,
        paddingTop: 6,
    },
    footerLeft: {
        fontSize: 6.5,
        color: C.muted,
        flex: 1,
    },
    footerRight: {
        fontSize: 6.5,
        color: C.brand,
        fontFamily: "Helvetica-Bold",
    },
});

export default LetterheadPDF;