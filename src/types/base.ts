// Common base interfaces
interface BaseDocument {
  id?: string;
  code?: string;
  notes: string;
  date: string;
  gst: number;
  discount: number;
  totalAmount?: number;
  customerName?: string;
  customerId: string | null;
}

interface BaseItem {
  id?: string;
  uom: string;
  description: string;
  quantity: number;
  price: number;
  gst: number;
  discount: number;
  notes: string;
  total: number;
}

// Specific extensions
export interface SaleInvoice extends BaseDocument {
  order_reference_no: string;
  quotationId?: string;
  quotationCode?: string | null;
}

export interface SaleInvoiceItem extends BaseItem {
  saleInvoiceId?: string;
  saleInvoiceCode?: string;
}

export interface Quotation extends BaseDocument {
  valid_until: string;
}

export interface QuotationItem extends BaseItem {
  quotationId?: string;
  quotationCode?: string;
}
