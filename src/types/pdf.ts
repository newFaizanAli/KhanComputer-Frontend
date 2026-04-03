// pdf/types.ts

import type {
  Customer,
  QuotationItem,
  StoreInfo,
  SaleInvoiceItem,
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
}
