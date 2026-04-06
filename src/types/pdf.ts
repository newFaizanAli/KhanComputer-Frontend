// pdf/types.ts

import type {
  Customer,
  QuotationItem,
  StoreInfo,
  SaleInvoiceItem,
  LetterHead,
} from "./index";

export interface DocumentMeta {
  code: string;
  date: string;
  /** Quotation: valid_until | Invoice: order_reference_no */
  thirdField: { label: string; value: string };
}

export interface NormalizedDocumentData {
  docType: "QUOTATION" | "INVOICE";
  meta: DocumentMeta;
  customer: Customer | null;
  store: StoreInfo | null;
  items: QuotationItem[] | SaleInvoiceItem[];
  discount: number;
  gst: number;
  notes?: string;

  /** When true: hides all GST/NTN fields on store, customer, items, and totals */
  is_tax_inclusive?: boolean;

  // ── Invoice-only extra fields ──────────────────────────────────────────────
  /** e.g. "cash", "bank_transfer", "cheque" */
  payment_method?: string | null;
  /** Bank tx ID, cheque number, etc. */
  payment_reference?: string | null;
  /** "paid" | "partial" | "unpaid" */
  payment_status?: string | null;
  /** The quotation this invoice was raised from */
  quotation_code?: string | null;
}

// ── Letterhead ────────────────────────────────────────────────────────────────

export interface NormalizedLetterheadData {
  /** The letterhead record itself */
  letterhead: LetterHead;
  /** Store info for header/footer branding */
  store: StoreInfo | null;
  /** Optional free-form body override — if not set, letterhead.default_body is used */
  body?: string | null;
}
