export interface SearchOption {
  value: string;
  label: string;
}

export interface DocumentItem {
  description: string;
  quantity: number;
  price: number;
  gst: number;
  discount: number;
  uom: string;
  notes: string;
  total: number;
}

export interface CombinedDocumentFormValues {
  customerId: string | null;
  customerName?: string;
  date: string;
  discount: number;
  gst: number;
  notes: string;
  items: DocumentItem[];
  // Quotation-only
  valid_until?: string;
  // Sale Invoice-only
  quotationId?: string | null;
  quotationCode?: string | null;
  order_reference_no?: string;
}
