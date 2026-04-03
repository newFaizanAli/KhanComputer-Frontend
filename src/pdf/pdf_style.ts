import { StyleSheet } from "@react-pdf/renderer";

const C = {
  brand: "#1a3c5e",
  brandD: "#122840",
  brandL: "#2a5a8a",
  brandX: "#d6e8f7",
  white: "#ffffff",
  dark: "#0d1f2d",
  muted: "#5a7a94",
  border: "#b0cfe0",
};

export const pdf_style = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.dark,
    backgroundColor: C.white,
  },

  // Header
  header: {
    backgroundColor: C.brand,
    paddingHorizontal: 36,
    paddingTop: 22,
    paddingBottom: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerLeft: { flex: 1 },
  companyName: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: C.white,
    marginBottom: 5,
  },
  contactLine: { fontSize: 7, color: C.brandX },
  badge: {
    backgroundColor: C.brandL,
    borderRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },
  badgeText: { fontSize: 12, fontFamily: "Helvetica-Bold", color: C.white },

  // Meta strip
  metaStrip: {
    backgroundColor: C.brandX,
    flexDirection: "row",
    paddingHorizontal: 36,
    paddingVertical: 10,
  },
  metaItem: { flex: 1 },
  metaDivider: { width: 1, backgroundColor: C.border, marginVertical: 2 },
  metaLabel: { fontSize: 6.5, color: C.muted, marginBottom: 3 },
  metaValue: { fontSize: 10, fontFamily: "Helvetica-Bold", color: C.brandD },

  // Info boxes
  infoRow: {
    flexDirection: "row",
    gap: 14,
    paddingHorizontal: 36,
    marginTop: 16,
  },
  infoBox: { flex: 1 },
  infoTitle: {
    backgroundColor: C.brandL,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },
  infoBody: {
    backgroundColor: C.brandX,
    paddingLeft: 13,
    paddingRight: 10,
    paddingVertical: 6,
    borderLeftWidth: 3,
    borderLeftColor: C.brandL,
  },
  infoName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: C.dark,
    marginBottom: 2,
  },
  infoLine: { fontSize: 7.5, color: C.muted, marginBottom: 1 },

  // Table
  tableWrap: { paddingHorizontal: 36, marginTop: 18 },
  tableHead: {
    backgroundColor: C.brandD,
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
  },
  tableHeadCell: { fontSize: 7, fontFamily: "Helvetica-Bold", color: C.white },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.3,
    borderBottomColor: C.border,
  },
  tableCell: { fontSize: 7.5, color: C.dark },

  // Totals
  totalsWrap: { paddingHorizontal: 36, alignItems: "flex-end", marginTop: 10 },
  totalsInner: { width: 210 },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: { fontSize: 8, color: C.muted },
  totalVal: { fontSize: 8, color: C.dark },
  grandBar: {
    backgroundColor: C.brand,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 6,
    borderRadius: 2,
  },
  grandLabel: { fontSize: 8, color: C.brandX },
  grandVal: { fontSize: 13, fontFamily: "Helvetica-Bold", color: C.white },

  // Notes
  notesWrap: { paddingHorizontal: 36, marginTop: 14 },
  notesTitle: {
    backgroundColor: C.brandL,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: C.white,
  },
  notesBody: {
    backgroundColor: C.brandX,
    paddingLeft: 13,
    paddingRight: 10,
    paddingVertical: 7,
    borderLeftWidth: 3,
    borderLeftColor: C.brandL,
    fontSize: 7.5,
    color: C.dark,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.brandD,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 36,
    paddingVertical: 9,
  },
  footerLeft: { fontSize: 6.5, color: C.brandX },
  footerRight: { fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.white },
});
