// pdf/config.ts

import { StyleSheet } from "@react-pdf/renderer";

export const C = {
  // ── Classic Business: Navy + Silver/Grey ──────────────────
  brand: "#22355d", // deep navy — primary brand colour
  brandLight: "#243558", // slightly lighter navy — hover / secondary surfaces
  brandX: "#f4f6f9", // near-white blue-grey — alternating table rows
  accent: "#92a2b9", // silver-blue — labels, dividers, subtle highlights
  invoiceAccent: "#2e4a7a", // mid navy — invoice badge (distinct from quotation)

  white: "#ffffff",
  text: "#1c2b3a", // near-black navy — body text
  muted: "#6b7d93", // cool grey — secondary text, notes
  border: "#d0d7e2", // light silver — borders, lines
  lightBg: "#f7f9fb", // off-white — info box backgrounds
  gold: "#c9a84c", // muted gold — grand total bar accent
};

/** Safe string: never returns undefined/null/NaN — always a printable string */
export const safe = (v: unknown): string => {
  if (v === null || v === undefined) return "—";
  const s = String(v).trim();
  return s === "" || s === "null" || s === "undefined" ? "—" : s;
};

/** Safe date: returns "—" for any falsy / invalid date */
export const fmtDate = (d: string | null | undefined): string => {
  if (!d) return "—";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? "—"
    : dt.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

/** Safe number format: treats null/undefined/NaN as 0 */
export const fmt = (v: number | string | null | undefined): string =>
  Number(v || 0).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export const ITEM_COLS = [
  { label: "#", flex: 0.4, align: "center" as const },
  { label: "Description", flex: 3.2, align: "left" as const },
  { label: "UOM", flex: 0.7, align: "center" as const },
  { label: "Qty", flex: 0.6, align: "center" as const },
  { label: "Unit Price", flex: 1.2, align: "right" as const },
  { label: "Disc %", flex: 0.7, align: "right" as const },
  { label: "GST %", flex: 0.7, align: "right" as const },
  { label: "Total", flex: 1.2, align: "right" as const },
];

export const pdf_style = StyleSheet.create({
  // ── Page ────────────────────────────────────────────────────
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.text,
    backgroundColor: C.white,
    paddingTop: 32,
    paddingBottom: 48,
    paddingHorizontal: 36,
  },

  // ── Header ──────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: C.brand, // solid navy underline — formal & clean
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
    color: C.muted, // grey tagline — understated
    letterSpacing: 1.5,
    marginTop: 1,
  },
  contactLine: {
    fontSize: 7.5,
    color: C.muted,
    marginTop: 3,
  },

  // ── Badge ───────────────────────────────────────────────────
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 3,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 85,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 2.5,
  },
  badgeSubText: {
    fontSize: 6.5,
    color: "#c8d4e3", // pale navy-white
    letterSpacing: 1.2,
    marginTop: 3,
  },

  // ── Meta strip ──────────────────────────────────────────────
  metaStrip: {
    flexDirection: "row",
    backgroundColor: C.brand,
    borderRadius: 3,
    paddingVertical: 9,
    paddingHorizontal: 14,
    marginBottom: 14,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: "column",
    flex: 1,
  },
  metaLabel: {
    fontSize: 6.5,
    color: C.accent, // silver-blue labels inside navy strip
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },
  metaDivider: {
    width: 1,
    backgroundColor: "#2e4060", // slightly lighter than brand
    marginHorizontal: 4,
  },

  // ── Info boxes (Bill To / From) ──────────────────────────────
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 14,
  },
  infoBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  infoTitle: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    backgroundColor: C.brand, // navy title bar — no cyan, classic look
    paddingVertical: 4,
    paddingHorizontal: 8,
    letterSpacing: 1.2,
  },
  infoBody: {
    padding: 8,
    backgroundColor: C.lightBg,
  },
  infoName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.brand,
    marginBottom: 2,
  },
  infoLine: {
    fontSize: 7.5,
    color: C.muted,
    marginBottom: 1.5,
  },

  // ── Table ───────────────────────────────────────────────────
  tableWrap: {
    marginBottom: 14,
    borderRadius: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
  },
  tableHead: {
    flexDirection: "row",
    backgroundColor: C.brand,
    paddingVertical: 7,
    paddingHorizontal: 6,
  },
  tableHeadCell: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    letterSpacing: 0.5,
    paddingHorizontal: 3,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: C.border, // thin silver separator between rows
  },
  tableCell: {
    fontSize: 7.5,
    color: C.text,
    paddingHorizontal: 3,
  },

  // ── Totals ──────────────────────────────────────────────────
  totalsWrap: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 14,
  },
  totalsInner: {
    width: 220,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    backgroundColor: C.lightBg,
  },
  totalLabel: {
    fontSize: 7.5,
    color: C.muted,
  },
  totalVal: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.text,
  },
  grandBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: C.brand,
  },
  grandLabel: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: C.gold, // muted gold label inside navy — classic look
    letterSpacing: 1,
  },
  grandVal: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },

  // ── Notes ───────────────────────────────────────────────────
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
    backgroundColor: C.brandLight, // slightly lighter navy than header
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

  // ── Terms strip (Quotation only) ────────────────────────────
  termsStrip: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  termBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 3,
    padding: 8,
    backgroundColor: C.lightBg,
  },
  termTitle: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    color: C.brand, // navy term titles — no cyan
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  termText: {
    fontSize: 7.5,
    color: C.muted,
    lineHeight: 1.4,
  },

  // ── Invoice status stamp ────────────────────────────────────
  stampWrap: {
    position: "absolute",
    top: 10,
    right: 10,
    borderWidth: 2,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  stampText: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 2,
  },

  // ── Footer ──────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 16,
    left: 36,
    right: 36,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: C.border, // silver border — subtle, not cyan
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
